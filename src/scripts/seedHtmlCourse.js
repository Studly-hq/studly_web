const axios = require('axios');

// Detailed HTML Course Data
const htmlCourse = {
    name: "HTML5 Fundamentals: The Complete Guide",
    description: "Master the foundation of web development. This course takes you from zero to building structured, semantic, and accessible web pages. You will learn the core tags, document structure, and best practices used by professional frontend developers.",
    category: "Tech",
    level: "beginner",
    duration_minutes: 90,
    image_url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    tags: ["cat:Tech", "html", "webdev", "frontend", "coding"],
    sections: [
        {
            title: "Introduction to HTML",
            order_index: 1,
            duration_minutes: 15,
            lessons: [
                {
                    title: "What is HTML?",
                    content: "### The Skeleton of the Web\n\nHTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. \n\n**Key Concepts:**\n\n1. **HyperText**: Text which contains links to other texts.\n2. **Markup**: The use of tags to indicate the structure and meaning of content.\n3. **Hierarchy**: HTML is nested, meaning elements sit inside other elements.\n\nThink of HTML as the **skeleton** of a website. Just like your skeleton gives your body shape, HTML gives the web page structure. Without it, the browser wouldn't know if a piece of text is a heading, a paragraph, or a button.",
                    order_index: 1,
                    duration_minutes: 5,
                    quiz: {
                        title: "HTML Basics Quiz",
                        passing_score: 70,
                        questions: [
                            {
                                question_text: "What does the 'M' in HTML stand for?",
                                question_type: "multiple_choice",
                                points: 10,
                                order_index: 1,
                                answers: [
                                    { answer_text: "Markup", is_correct: true, order_index: 1 },
                                    { answer_text: "Machine", is_correct: false, order_index: 2 },
                                    { answer_text: "Multiple", is_correct: false, order_index: 3 },
                                    { answer_text: "Method", is_correct: false, order_index: 4 }
                                ]
                            },
                            {
                                question_text: "True or False: HTML is a programming language.",
                                question_type: "multiple_choice",
                                points: 10,
                                order_index: 2,
                                answers: [
                                    { answer_text: "True", is_correct: false, order_index: 1 },
                                    { answer_text: "False (It is a markup language)", is_correct: true, order_index: 2 }
                                ]
                            }
                        ]
                    }
                },
                {
                    title: "The Standard Document Structure",
                    content: "### A Valid HTML Document\n\nEvery HTML5 document must follow a specific boilerplate. Here is the structure:\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>My First Site</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>\n```\n\n- `<!DOCTYPE html>`: Tells the browser it's an HTML5 document.\n- `<html>`: The root element.\n- `<head>`: Contains metadata (non-visible info like title and scripts).\n- `<body>`: Contains everything visible to the user.",
                    order_index: 2,
                    duration_minutes: 10,
                }
            ]
        },
        {
            title: "Common Tags and Text",
            order_index: 2,
            duration_minutes: 30,
            lessons: [
                {
                    title: "Headings and Paragraphs",
                    content: "### Structuring Text\n\nHTML provides 6 levels of headings:\n- `<h1>`: The most important heading (one per page typically).\n- `<h6>`: The least important.\n\nParagraphs are created using the `<p>` tag.\n\n**Example:**\n```html\n<h1>Main Heading</h1>\n<p>This is a paragraph of text explaining the topic.</p>\n```",
                    order_index: 1,
                    duration_minutes: 10,
                    quiz: {
                        title: "Text Elements Quiz",
                        passing_score: 100,
                        questions: [
                            {
                                question_text: "Which heading tag represents the largest, most important title?",
                                question_type: "multiple_choice",
                                points: 10,
                                order_index: 1,
                                answers: [
                                    { answer_text: "h6", is_correct: false, order_index: 1 },
                                    { answer_text: "title", is_correct: false, order_index: 2 },
                                    { answer_text: "h1", is_correct: true, order_index: 3 },
                                    { answer_text: "head", is_correct: false, order_index: 4 }
                                ]
                            }
                        ]
                    }
                },
                {
                    title: "Lists: Ordered and Unordered",
                    content: "### Organizing Information with Lists\n\nThere are two main types of lists:\n\n1. **Unordered Lists (`<ul>`)**: Bulleted lists.\n2. **Ordered Lists (`<ol>`)**: Numbered lists.\n\nBoth require `<li>` (List Item) tags inside them.\n\n**Example:**\n```html\n<ul>\n  <li>Coffee</li>\n  <li>Tea</li>\n</ul>\n```",
                    order_index: 2,
                    duration_minutes: 10,
                }
            ]
        },
        {
            title: "Links and Images",
            order_index: 3,
            duration_minutes: 25,
            lessons: [
                {
                    title: "The Anchor Tag (Links)",
                    content: "### Connecting the Web\n\nLinks are created using the `<a>` tag with the `href` attribute.\n\n```html\n<a href=\"https://google.com\">Visit Google</a>\n```\n\n'href' stands for **Hypertext Reference**.",
                    order_index: 1,
                    duration_minutes: 10,
                },
                {
                    title: "Adding Visuals with <img>",
                    content: "### Images\n\nImages are self-closing (void) tags using the `<img>` tag. They require two critical attributes:\n\n1. `src`: The path to the image file.\n2. `alt`: Alternative text for screen readers (accessibility).\n\n```html\n<img src=\"logo.png\" alt=\"Studly Logo\">\n```",
                    order_index: 2,
                    duration_minutes: 15,
                    quiz: {
                        title: "Multimedia Quiz",
                        passing_score: 50,
                        questions: [
                            {
                                question_text: "Which attribute is REQUIRED for an image to be accessible to screen readers?",
                                question_type: "multiple_choice",
                                points: 15,
                                order_index: 1,
                                answers: [
                                    { answer_text: "href", is_correct: false, order_index: 1 },
                                    { answer_text: "alt", is_correct: true, order_index: 2 },
                                    { answer_text: "title", is_correct: false, order_index: 3 },
                                    { answer_text: "src", is_correct: false, order_index: 4 }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    ]
};

const seed = async () => {
    const token = process.argv[2];
    if (!token) {
        console.error("Usage: node seedHtmlCourse.js <YOUR_AUTH_TOKEN>");
        process.exit(1);
    }

    try {
        const response = await axios.post('http://localhost:3000/coursebank/course', htmlCourse, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Course seeded successfully!");
        console.log("ID:", response.data.course_id);
    } catch (error) {
        console.error("Seeding failed:");
        console.error(error.response?.data || error.message);
    }
};

seed();
