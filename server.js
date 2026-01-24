const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { parse } = require('node-html-parser');

const app = express();
const PORT = process.env.PORT || 8080;
const API_BASE_URL = 'https://studly-server-production.up.railway.app';

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build'), { index: false }));

// Helper to inject meta tags
function injectMeta(html, metadata) {
    const root = parse(html);
    const head = root.querySelector('head');

    const tags = [
        { property: 'og:title', content: metadata.title },
        { property: 'og:description', content: metadata.description },
        { property: 'og:image', content: metadata.image },
        { property: 'og:url', content: metadata.url },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: metadata.image ? 'summary_large_image' : 'summary' },
        { name: 'twitter:title', content: metadata.title },
        { name: 'twitter:description', content: metadata.description },
        { name: 'twitter:image', content: metadata.image }
    ];

    tags.forEach(tag => {
        const attr = tag.property ? 'property' : 'name';
        const value = tag.property || tag.name;

        // Remove existing tag if any
        const existing = head.querySelector(`meta[${attr}="${value}"]`);
        if (existing) existing.remove();

        // Add new tag
        const meta = `<meta ${attr}="${value}" content="${tag.content}">`;
        head.insertAdjacentHTML('beforeend', meta);
    });

    // Update title tag
    const titleTag = head.querySelector('title');
    if (titleTag) {
        titleTag.set_content(metadata.title);
    } else {
        head.insertAdjacentHTML('beforeend', `<title>${metadata.title}</title>`);
    }

    return root.toString();
}

// Handle specific post routes for SSR meta injection
app.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;
    const buildPath = path.join(__dirname, 'build');
    const indexPath = path.join(buildPath, 'index.html');

    // Safety check: if build folder doesn't exist, provide basic feedback
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Application build not found. Please run "npm run build" first.');
    }

    try {
        // 1. Read index.html
        const html = fs.readFileSync(indexPath, 'utf8');

        // 2. Fetch post data from backend
        console.log(`[SSR] Fetching data for post ${postId}...`);
        const response = await axios.get(`${API_BASE_URL}/studlygram/post/${postId}`, {
            timeout: 5000 // 5s timeout
        });
        const post = response.data;

        if (!post) throw new Error('Post not found in backend response');

        // 3. Prepare metadata
        const metadata = {
            title: `${post.post_content?.substring(0, 60)}${post.post_content?.length > 60 ? '...' : ''} | Studly`,
            description: post.post_content?.substring(0, 160) || 'Check out this post on Studly!',
            image: post.post_media && post.post_media.length > 0 ? post.post_media[0] : `https://${req.get('host')}/logo.png`,
            url: `https://${req.get('host')}${req.originalUrl}`
        };

        // 4. Injected hydrated HTML
        console.log(`[SSR] Successfully hydrated HTML for post ${postId}`);
        const hydratedHtml = injectMeta(html, metadata);
        res.send(hydratedHtml);

    } catch (error) {
        console.error(`[SSR] Error for post ${postId}:`, error.message);
        // On error or timeout, just serve the normal index.html as fallback
        res.sendFile(indexPath);
    }
});

// Always return the main index.html for any other routes (Standard SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`SSR Server is running on port ${PORT}`);
});
