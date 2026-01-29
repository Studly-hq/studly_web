import React from 'react';

/**
 * Formats text content by:
 * 1. Detecting URLs and converting them to clickable links
 * 2. Highlighting hashtags with accent color
 * 3. Preserving whitespace/newlines
 * 
 * @param {string} content - The raw text content
 * @param {Array} tags - Optional array of tags (used for reference, hashtags are highlighted inline)
 * @returns {React.ReactNode} - Formatted content with links and highlighted hashtags
 */
export const formatContent = (content, tags = []) => {
    if (!content) return null;

    let displayContent = content.trim();

    // Combined regex to detect URLs and hashtags
    // URLs: (protocol://domain... OR www.domain...)
    // Hashtags: #word
    const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/;
    const hashtagRegex = /(#\w+)/;
    const combinedRegex = new RegExp(`${urlRegex.source}|${hashtagRegex.source}`, 'g');

    const parts = displayContent.split(combinedRegex).filter(part => part !== undefined && part !== '');

    return (
        <span className="whitespace-pre-wrap break-words leading-relaxed">
            {parts.map((part, index) => {
                // Check if it's a URL
                if (part.match(/^(?:https?:\/\/|www\.)/)) {
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
                // Check if it's a hashtag
                if (part.match(/^#\w+$/)) {
                    return (
                        <span
                            key={index}
                            className="text-reddit-orange font-medium"
                        >
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </span>
    );
};
