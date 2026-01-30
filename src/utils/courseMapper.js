/**
 * Utility to map live CourseBank API data to the frontend's topic/section/scene structure.
 */

export const mapApiCourseToTopic = (course) => {
    if (!course) return null;

    return {
        id: String(course.course_id || course.id),
        title: course.name || course.title,
        subtitle: course.description || '',
        category: (course.tags || []).find(t => t.startsWith('cat:'))?.split(':')[1] || 'Tech',
        difficulty: course.level || 'Beginner',
        estimatedMinutes: course.duration_minutes || 30,
        tags: (course.tags || []).filter(t => !t.startsWith('cat:')),
        imageUrl: course.image_url,
        sections: (course.sections || []).map(mapApiSectionToSection),
        sectionsCount: course.sections_count || (course.sections ? course.sections.length : 0),
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
                lessonId: lesson.lesson_id,
                type: 'text', // Defaulting to text, but could be 'media' if logic allows
                title: lesson.lesson_title,
                content: lesson.lesson_content,
                order: lesson.lesson_order,
                completed: lesson.completed, // Add completion status
            });

            // 3. Add associated Quiz questions as scenes if they exist
            if (lesson.quiz && lesson.quiz.questions) {
                lesson.quiz.questions.forEach((question) => {
                    scenes.push({
                        id: String(question.id),
                        quizId: lesson.quiz.quiz_id,
                        lessonId: lesson.lesson_id,
                        type: 'quiz',
                        title: lesson.quiz.title || 'Quiz',
                        question: question.question_text,
                        choices: (question.answers || []).map(a => ({
                            id: String(a.id),
                            text: a.answer_text,
                            correct: a.is_correct
                        })),
                        correctAnswerIds: (question.answers || [])
                            .filter(a => a.is_correct)
                            .map(a => String(a.id)), // Store for context validation
                        points: question.points || 10,
                        multiSelect: question.question_type === 'multiple_choice' &&
                            (question.answers || []).filter(a => a.is_correct).length > 1,
                        explanation: "Correct answer identified based on course material.",
                        completed: lesson.quiz.passed, // Add completion status for quiz questions
                    });
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
