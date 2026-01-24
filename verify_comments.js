const axios = require('axios');

const BASE_URL = 'https://studly-server-production.up.railway.app';
const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

async function verify() {
    try {
        // 1. Signup
        const email = `test_reply_${Date.now()}@test.com`;
        const password = 'password123';

        const signupRes = await client.post('/auth/signup', { email, password, name: 'TestUser' });

        let token = signupRes.data ? signupRes.data.token : null;
        let user = signupRes.data ? signupRes.data.user : null;

        if (!token) {
            const loginRes = await client.post('/auth/login', { email, password });
            token = loginRes.data.token;
            user = loginRes.data.user;
        }

        if (!token) throw new Error('No token received even after login');

        if (!user && token) {
            try {
                const parts = token.split('.');
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                user = { id: payload.sub };
            } catch (err) {
                console.error('Failed to extract user from token:', err.message);
            }
        }

        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 1.5 Get Profile to get Username
        const profileRes = await client.get('/profile/profile');
        const username = profileRes.data.username;

        // 2. Create Post
        const content = `Test reply persistence ${Date.now()}`;
        const postRes = await client.post('/studlygram/post', {
            content: content,
            type: 'text',
            media_url: [],
            tags: []
        });

        let postId = postRes.data ? (postRes.data.id || postRes.data.post_id) : undefined;

        if (!postId) {
            const postsRes = await client.get(`/studlygram/posts/${username}`);
            const myPost = postsRes.data.find(p => p.post_content === content || p.content === content);
            if (myPost) {
                postId = myPost.post_id || myPost.id;
            } else {
            }
        }

        if (!postId) throw new Error('Failed to get post ID');

        // 3. Create Root Comment
        console.log('Creating root comment...');
        const rootCommentRes = await client.post(`/studlygram/${postId}/comment`, {
            content: 'Root comment',
            post_id: String(postId),
            user_id: String(user.id)
        });
        console.log('Root Comment Response:', JSON.stringify(rootCommentRes.data, null, 2));
        const rootCommentId = rootCommentRes.data.id || rootCommentRes.data.comment_id;
        if (!rootCommentId) throw new Error('Failed to get root comment ID');
        console.log(`Root comment created: ${rootCommentId}`);

        // 4. Create Reply
        const replyPayload = {
            content: 'Reply comment',
            post_id: String(postId),
            user_id: String(user.id),
            parent_comment_id: String(rootCommentId),
            parent_id: String(rootCommentId) // Redundant field as per fix
        };
        const replyRes = await client.post(`/studlygram/${postId}/comment`, replyPayload);
        const replyId = replyRes.data.id || replyRes.data.comment_id;
        console.log(`Reply created: ${replyId} (Parent: ${rootCommentId})`);

        // 5. Fetch Comments
        const fetchRes = await client.get(`/studlygram/${postId}/comments`);
        const comments = fetchRes.data;
        console.log('Fetched comments count:', comments.length);

        // 6. Analyze
        const replyFound = JSON.stringify(comments).includes(replyId);
        console.log(`Reply ID found in response: ${replyFound}`);
        if (replyFound) console.log('SUCCESS: Reply persisted correctly.');
        else {
            console.error('FAILURE: Reply not found in fetched comments.');
            console.log('Fetched comments dump:', JSON.stringify(comments, null, 2));
        }

        // Clean up
        if (postId) {
            await client.delete(`/studlygram/post/${postId}`);
        }

    } catch (e) {
        console.error('Error:', e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
        if (e.stack) console.error(e.stack);
    }
}

verify().then(() => {
    console.log('Verification script completed.');
    // Keep alive briefly to ensure flush
    setTimeout(() => process.exit(0), 1000);
}).catch(err => {
    console.error('Unhandled verification error:', err);
    process.exit(1);
});
