/**
 * Utility functions for frontend input sanitization.
 * Note: Real sanitization MUST always happen on the backend. 
 * This is an extra layer of defense-in-depth for the frontend.
 */

export const sanitizeText = (input) => {
    if (typeof input !== 'string') return '';
    // Basic stripping of common XSS vector tags, though React handles escaping natively
    // We mainly want to strip HTML tags if we don't want users submitting rich text here.
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>?/gm, '') // Strip all HTML tags
        .trim();
};

export const sanitizeUsername = (input) => {
    if (typeof input !== 'string') return '';
    // Allow only alphanumeric and underscores
    return input.replace(/[^a-zA-Z0-9_]/g, '').trim();
};

export const validatePostId = (id) => {
    if (typeof id !== 'string') return false;
    // UUID or alphanumeric
    return /^[a-zA-Z0-9-]+$/.test(id);
};

export const sanitizeSearchQuery = (input) => {
    if (typeof input !== 'string') return '';
    // Remove characters that might be used in SQL/NoSQL injection (though backend should handle it)
    return input.replace(/['";\\]/g, '').trim();
};
