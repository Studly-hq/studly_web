import React from 'react';

/**
 * Formats text content by:
 * 1. Detecting URLs and converting them to clickable links
 * 2. Removing hashtags from display (optional, based on logic in PostCard)
 * 3. Preserving whitespace/newlines
 * 
 * @param {string} content - The raw text content
 * @param {Array} tags - Optional array of tags to remove from display (hashtags)
 * @returns {React.ReactNode} - Formatted content with links
 */
export const formatContent = (content, tags = []) => {
    if (!content) return null;

    let displayContent = content;

    // Remove hashtags if provided (PostCard logic)
    if (tags && tags.length > 0) {
        tags.forEach((tag) => {
            const regex = new RegExp(`#${tag}\\b`, "gi");
            displayContent = displayContent.replace(regex, "");
        });
    }

    // Normalize multiple spaces but preserve newlines? 
    // PostCard had: displayContent = displayContent.trim().replace(/\s\s+/g, " ");
    // But this removes newlines if \s includes \n. \s match space, tab, new line, etc.
    // If we want to preserve newlines, we should use a different regex or skip this.
    // The user asked for "formatted well automatically", so preserving paragraphs (newlines) is crucial.
    // I will REMOVE the aggressive whitespace collapse if it destroys newlines. 
    // Instead, I'll just trim start/end.
    displayContent = displayContent.trim();

    // Regex to detect URLs (http, https, www)
    // Captures: (protocol://domain... OR www.domain...)
    // We use a simplified robust regex
    const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;

    const parts = displayContent.split(urlRegex);

    return (
        <span className="whitespace-pre-wrap break-words leading-relaxed">
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    let href = part;
                    if (part.startsWith('www.')) {
                        href = `https://${part}`;
                    }
                    return (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-reddit-orange hover:underline z-10 relative"
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            })}
        </span>
    );
};
