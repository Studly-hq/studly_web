/**
 * Utility to map live CourseBank API data to the frontend's topic/section/scene structure.
 */

export const mapApiCourseToTopic = (course) => {
    if (!course) return null;

    return {
        id: String(course.course_id || course.id),
        title: course.name || course.title,
        subtitle: course.description || '',
        category: course.category || 'Technology',
        difficulty: course.level || 'Beginner',
        estimatedMinutes: course.duration_minutes || 30,
        tags: course.tags || [],
        imageUrl: course.image_url,
        sections: (course.sections || []).map(mapApiSectionToSection),
        isApiCourse: true,
    };
};

export const mapApiSectionToSection = (section, index) => {
    const scenes = [];

    // 1. Add Section Media as the first scene (if it's a video/image)
    if (section.media && section.media.url) {
        scenes.push({
            id: `media-${section.section_id || index}`,
            type: section.media.media_type === 'video' ? 'video' : 'media',
            url: section.media.url,
            title: section.media.title || 'Introduction',
            videoId: section.media.media_type === 'video' ? extractVideoId(section.media.url) : null,
        });
    }

    // 2. Add Lessons as scenes
    if (section.lessons) {
        section.lessons.forEach((lesson) => {
            // Add the content scene
            scenes.push({
                id: String(lesson.lesson_id || lesson.id),
                type: 'text', // Defaulting to text, but could be 'media' if logic allows
                title: lesson.lesson_title,
                content: lesson.lesson_content,
                order: lesson.lesson_order,
            });

            // 3. Add associated Quiz as a scene if it exists
            if (lesson.quiz_id || lesson.quiz) {
                scenes.push({
                    id: String(lesson.quiz_id || (lesson.quiz && lesson.quiz.id)),
                    type: 'quiz',
                    title: 'Quiz',
                    lesson_id: lesson.lesson_id,
                    // Note: Full quiz details might need a separate fetch or be nested
                    ...(lesson.quiz || {}),
                });
            }
        });
    }

    // 4. Ensure Video-First logic: Sort scenes once more to be safe
    const sortedScenes = scenes.sort((a, b) => {
        if (a.type === 'video' && b.type !== 'video') return -1;
        if (a.type !== 'video' && b.type === 'video') return 1;
        return 0;
    });

    return {
        id: String(section.section_id || index),
        title: section.section_title || 'Untitled Section',
        order: section.section_order || index,
        scenes: sortedScenes,
    };
};

const extractVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
};
