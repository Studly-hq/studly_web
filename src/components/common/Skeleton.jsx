import React from 'react';

/**
 * Base Skeleton component with shimmer animation
 * Use this as a base for all skeleton loaders
 */
const Skeleton = ({
    className = '',
    width,
    height,
    rounded = 'rounded',
    animate = true
}) => {
    const baseClasses = `bg-reddit-cardHover ${rounded} ${animate ? 'animate-pulse' : ''}`;

    const style = {
        width: width || '100%',
        height: height || '1rem',
    };

    return (
        <div
            className={`${baseClasses} ${className}`}
            style={style}
        />
    );
};

/**
 * Skeleton for a single post card
 */
export const PostCardSkeleton = () => (
    <div className="bg-reddit-card rounded border border-reddit-border p-4">
        {/* User info */}
        <div className="flex items-center gap-3 mb-4">
            <Skeleton width="40px" height="40px" rounded="rounded-full" />
            <div className="flex-1">
                <Skeleton width="120px" height="14px" className="mb-2" />
                <Skeleton width="80px" height="12px" />
            </div>
        </div>

        {/* Content */}
        <div className="space-y-2 mb-4">
            <Skeleton height="14px" />
            <Skeleton height="14px" width="90%" />
            <Skeleton height="14px" width="75%" />
        </div>

        {/* Image placeholder (occasionally) */}
        <Skeleton height="200px" rounded="rounded-lg" className="mb-4" />

        {/* Actions bar */}
        <div className="flex items-center gap-4 pt-3 border-t border-reddit-border">
            <Skeleton width="60px" height="24px" rounded="rounded-full" />
            <Skeleton width="60px" height="24px" rounded="rounded-full" />
            <Skeleton width="60px" height="24px" rounded="rounded-full" />
        </div>
    </div>
);

/**
 * Skeleton for a text-only post (no image)
 */
export const PostCardSkeletonText = () => (
    <div className="bg-reddit-card rounded border border-reddit-border p-4">
        {/* User info */}
        <div className="flex items-center gap-3 mb-4">
            <Skeleton width="40px" height="40px" rounded="rounded-full" />
            <div className="flex-1">
                <Skeleton width="120px" height="14px" className="mb-2" />
                <Skeleton width="80px" height="12px" />
            </div>
        </div>

        {/* Content */}
        <div className="space-y-2 mb-4">
            <Skeleton height="14px" />
            <Skeleton height="14px" width="85%" />
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-4 pt-3 border-t border-reddit-border">
            <Skeleton width="50px" height="20px" rounded="rounded-full" />
            <Skeleton width="50px" height="20px" rounded="rounded-full" />
            <Skeleton width="50px" height="20px" rounded="rounded-full" />
        </div>
    </div>
);

/**
 * Multiple post skeletons for feed loading
 */
export const FeedSkeleton = ({ count = 3 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            i % 2 === 0 ? <PostCardSkeleton key={i} /> : <PostCardSkeletonText key={i} />
        ))}
    </div>
);

/**
 * Skeleton for profile header
 */
export const ProfileHeaderSkeleton = () => (
    <div className="py-6 mb-6">
        {/* Profile Image & Basic Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                {/* Avatar */}
                <Skeleton width="96px" height="96px" rounded="rounded-full" />

                <div className="flex-1">
                    {/* Name */}
                    <Skeleton width="160px" height="24px" className="mb-2" />
                    {/* Username */}
                    <Skeleton width="100px" height="16px" className="mb-3" />

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                        <Skeleton width="80px" height="14px" />
                        <Skeleton width="60px" height="14px" />
                    </div>
                </div>
            </div>

            {/* Edit button */}
            <Skeleton width="80px" height="36px" rounded="rounded" />
        </div>

        {/* Bio */}
        <Skeleton height="14px" className="mb-2" />
        <Skeleton height="14px" width="70%" className="mb-4" />

        {/* Meta Info */}
        <Skeleton width="150px" height="12px" />
    </div>
);

/**
 * Skeleton for comment
 */
export const CommentSkeleton = () => (
    <div className="flex gap-3 mt-4">
        <Skeleton width="32px" height="32px" rounded="rounded-full" />
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <Skeleton width="80px" height="12px" />
                <Skeleton width="40px" height="10px" />
            </div>
            <Skeleton height="12px" className="mb-1" />
            <Skeleton height="12px" width="80%" />
        </div>
    </div>
);

/**
 * Multiple comment skeletons
 */
export const CommentsSkeleton = ({ count = 3 }) => (
    <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
            <CommentSkeleton key={i} />
        ))}
    </div>
);

/**
 * Skeleton for a course card in the CourseBank
 */
export const CourseCardSkeleton = () => (
    <div className="bg-reddit-card rounded-2xl border border-white/5 p-5">
        <div className="flex justify-between items-start mb-4">
            <Skeleton width="48px" height="48px" rounded="rounded-xl" />
            <Skeleton width="60px" height="24px" rounded="rounded-full" />
        </div>
        <Skeleton width="80%" height="20px" className="mb-2" />
        <Skeleton width="60%" height="16px" className="mb-6" />
        <div className="flex gap-2">
            <Skeleton width="50px" height="20px" rounded="rounded-full" />
            <Skeleton width="50px" height="20px" rounded="rounded-full" />
        </div>
    </div>
);

/**
 * Skeleton for the TopicPlayer page
 */
export const TopicPlayerSkeleton = () => (
    <div className="min-h-screen bg-reddit-bg">
        {/* Nav skeleton */}
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between">
            <Skeleton width="120px" height="24px" />
            <Skeleton width="40px" height="40px" rounded="rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Title skeleton */}
            <Skeleton width="60%" height="32px" className="mb-6" />

            {/* Video/Content area placeholder */}
            <Skeleton height="400px" rounded="rounded-2xl" className="mb-8" />

            {/* Tabs placeholder */}
            <div className="flex gap-4 mb-6 pt-4 border-t border-white/5">
                <Skeleton width="80px" height="24px" />
                <Skeleton width="80px" height="24px" />
            </div>

            {/* Content text placeholder */}
            <div className="space-y-4">
                <Skeleton height="16px" />
                <Skeleton height="16px" />
                <Skeleton height="16px" width="70%" />
            </div>
        </div>
    </div>
);

export default Skeleton;
