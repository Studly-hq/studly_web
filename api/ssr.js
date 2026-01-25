const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { parse } = require('node-html-parser');

const API_BASE_URL = 'https://studly-server-production.up.railway.app';

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

module.exports = async (req, res) => {
    // Determine the post ID from the query parameter (Vercel rewrite logic)
    // The rewrite in vercel.json will send /post/:id -> /api/ssr?postId=:id
    const { postId } = req.query;

    if (!postId) {
        return res.status(400).send('Missing Post ID');
    }

    try {
        // 1. Read index.html
        // In Vercel Serverless, 'index.html' from the public folder is usually output to the root task var,
        // but reading it from the filesystem can be tricky.
        // A reliable fallback for Vercel functions is to read the file relative to the process cwd or use a path resolve.
        // We will try to resolve it from the standard Vercel build output location.
        const indexPath = path.join(process.cwd(), 'public', 'index.html');
        // NOTE: If this fails in production because Vercel doesn't include 'public' in functions, 
        // we might need to fetch it via HTTP from the deployment URL itself, but let's try reading first.
        // As a fallback, we can read the file using fs from a known location if configured in vercel.json "includeFiles"

        // Simpler approach for reliability: Fetch the static HTML from the running deployment
        // Vercel sets the host header required to fetch from itself
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const indexUrl = `${protocol}://${host}/index.html`;

        console.log(`[SSR] Fetching base HTML from ${indexUrl}`);
        const htmlResponse = await axios.get(indexUrl);
        const html = htmlResponse.data;

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
            image: post.post_media && post.post_media.length > 0 ? post.post_media[0] : `${protocol}://${host}/logo.png`,
            url: `${protocol}://${host}/post/${postId}`
        };

        // 4. Injected hydrated HTML
        console.log(`[SSR] Successfully hydrated HTML for post ${postId}`);
        const hydratedHtml = injectMeta(html, metadata);

        // Cache control for performance (e.g., cache for 60 seconds)
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.send(hydratedHtml);

    } catch (error) {
        console.error(`[SSR] Error for post ${postId}:`, error.message);
        // On error, redirect to the client-side route so at least the page loads (even if preview fails)
        res.redirect(`/post/${postId}`);
    }
};
