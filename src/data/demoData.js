// demoData.js - Complete mock data for Studly platform

export const demoData = {
  user: {
    name: "Alex",
    avatar: "👤",
    auraPoints: 2450,
    streak: 7
  },

  subjects: [
    {
      id: "maths",
      title: "Maths",
      icon: "🧮",
      tagline: "Master problem-solving from basics to calculus",
      category: "STEM",
      progress: 45,
      topics: [
        {
          id: "algebra",
          title: "Algebra",
          progress: 60,
          duration: "25 mins",
          xp: 250,
          status: "unlocked",
          lessons: [
            {
              id: "lesson1",
              title: "Introduction to Variables",
              sections: [
                {
                  id: "intro",
                  type: "text",
                  content: "Welcome to Algebra! Let's start with the basics.\n\nVariables are one of the most powerful tools in mathematics. They allow us to work with unknown values and solve real-world problems.\n\nThink of a variable as a container that can hold different values. Just like a box can hold different items, a variable can represent different numbers."
                },
                {
                  id: "what-is-var",
                  type: "text",
                  content: "What is a Variable?\n\nA variable is a symbol (usually a letter) that represents a number we don't know yet. The most common variables are x, y, and z, but you can use any letter.\n\nFor example, if we say x = 5, we're telling the variable x to hold the value 5."
                },
                {
                  id: "checkpoint1",
                  type: "checkpoint",
                  question: "Do you understand what a variable is?"
                },
                {
                  id: "simple-equations",
                  type: "text",
                  content: "Simple Equations\n\nAn equation is like a balance scale. What's on the left side must equal what's on the right side.\n\nLet's look at a simple equation:"
                },
                {
                  id: "equation1",
                  type: "math",
                  inline: false,
                  content: "x + 3 = 7"
                },
                {
                  id: "solving-explanation",
                  type: "text",
                  content: "To solve this equation, we need to find what value of x makes both sides equal.\n\nWe can subtract 3 from both sides:"
                },
                {
                  id: "equation2",
                  type: "math",
                  inline: false,
                  content: "x + 3 - 3 = 7 - 3"
                },
                {
                  id: "equation3",
                  type: "math",
                  inline: false,
                  content: "x = 4"
                },
                {
                  id: "checkpoint2",
                  type: "checkpoint",
                  question: "Does the solving process make sense so far?"
                },
                {
                  id: "quiz1",
                  type: "quiz",
                  question: "Solve for x: x + 5 = 12",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "x = 7", correct: true },
                    { id: "b", text: "x = 17", correct: false },
                    { id: "c", text: "x = 5", correct: false },
                    { id: "d", text: "x = 12", correct: false }
                  ],
                  explanation: "To solve x + 5 = 12, we subtract 5 from both sides: x = 12 - 5 = 7"
                },
                {
                  id: "inline-math",
                  type: "text",
                  content: "Great! Now let's try something with multiplication. Remember, when we have $2x = 10$, we divide both sides by 2 to get $x = 5$."
                },
                {
                  id: "quiz2",
                  type: "quiz",
                  question: "True or False: Variables can only be the letter x",
                  quizType: "true-false",
                  correctAnswer: false,
                  explanation: "False! Variables can be any letter. We commonly use x, y, z, but you can use a, b, c, or even Greek letters like θ (theta)."
                },
                {
                  id: "practice",
                  type: "text",
                  content: "Excellent work! You now understand the basics of variables and simple equations.\n\nIn the next lesson, we'll explore more complex equations and learn how to work with multiple variables."
                }
              ]
            },
            {
              id: "lesson2",
              title: "Working with Expressions",
              sections: [
                {
                  id: "expressions-intro",
                  type: "text",
                  content: "Welcome back! Now that you understand variables, let's learn about algebraic expressions.\n\nAn expression is a mathematical phrase that can contain numbers, variables, and operations (like +, -, ×, ÷)."
                },
                {
                  id: "expression-examples",
                  type: "text",
                  content: "Here are some examples of expressions:"
                },
                {
                  id: "expr1",
                  type: "math",
                  inline: false,
                  content: "3x + 5"
                },
                {
                  id: "expr2",
                  type: "math",
                  inline: false,
                  content: "2y - 7 + 4y"
                },
                {
                  id: "expr3",
                  type: "math",
                  inline: false,
                  content: "x^2 + 2x + 1"
                },
                {
                  id: "checkpoint3",
                  type: "checkpoint",
                  question: "Can you see the difference between an equation and an expression?"
                },
                {
                  id: "combining-terms",
                  type: "text",
                  content: "Combining Like Terms\n\nLike terms are terms that have the same variable raised to the same power. We can combine them by adding or subtracting their coefficients.\n\nFor example, in the expression $3x + 5x$, both terms have the variable x, so we can add them:"
                },
                {
                  id: "combine-example",
                  type: "math",
                  inline: false,
                  content: "3x + 5x = 8x"
                },
                {
                  id: "quiz3",
                  type: "quiz",
                  question: "Simplify: 4y + 3y - 2y",
                  quizType: "fill-blank",
                  correctAnswer: "5y",
                  explanation: "Combine the coefficients: 4 + 3 - 2 = 5, so the answer is 5y"
                },
                {
                  id: "quiz4",
                  type: "quiz",
                  question: "What is the simplified form of: 2x + 3 + 4x + 7",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "6x + 10", correct: true },
                    { id: "b", text: "16x", correct: false },
                    { id: "c", text: "2x + 14", correct: false },
                    { id: "d", text: "9x + 3", correct: false }
                  ],
                  explanation: "Combine like terms: (2x + 4x) + (3 + 7) = 6x + 10"
                },
                {
                  id: "conclusion",
                  type: "text",
                  content: "Fantastic! You've mastered the basics of algebraic expressions.\n\nYou can now identify like terms, combine them, and simplify expressions. These skills are fundamental for all future algebra work!"
                }
              ]
            }
          ]
        },
        {
          id: "trigonometry",
          title: "Trigonometry",
          progress: 0,
          duration: "30 mins",
          xp: 300,
          status: "unlocked",
          lessons: []
        },
        {
          id: "geometry",
          title: "Geometry",
          progress: 0,
          duration: "20 mins",
          xp: 200,
          status: "locked",
          lessons: []
        }
      ]
    },
    {
      id: "coding",
      title: "Coding",
      icon: "💻",
      tagline: "Build the future with code, one line at a time",
      category: "Tech",
      progress: 30,
      topics: [
        {
          id: "python-basics",
          title: "Python Basics",
          progress: 40,
          duration: "20 mins",
          xp: 200,
          status: "unlocked",
          lessons: [
            {
              id: "lesson1",
              title: "Your First Python Program",
              sections: [
                {
                  id: "python-intro",
                  type: "text",
                  content: "Welcome to Python Programming!\n\nPython is one of the most popular programming languages in the world. It's used for web development, data science, artificial intelligence, and much more.\n\nLet's write your first Python program together!"
                },
                {
                  id: "hello-world",
                  type: "text",
                  content: "The Hello World Tradition\n\nEvery programmer starts with a 'Hello World' program. It's a simple program that displays a message on the screen.\n\nHere's how you do it in Python:"
                },
                {
                  id: "code1",
                  type: "code",
                  language: "python",
                  content: 'print("Hello, World!")'
                },
                {
                  id: "print-explanation",
                  type: "text",
                  content: "Let's break this down:\n\nThe word 'print' is a function that tells Python to display something on the screen. The text inside the quotes is what will be displayed.\n\nIn Python, anything inside quotes is called a string."
                },
                {
                  id: "checkpoint4",
                  type: "checkpoint",
                  question: "Does this make sense? Ready to try more?"
                },
                {
                  id: "variables-python",
                  type: "text",
                  content: "Variables in Python\n\nJust like in algebra, we use variables in programming to store values. In Python, creating a variable is super easy:"
                },
                {
                  id: "code2",
                  type: "code",
                  language: "python",
                  content: 'name = "Alex"\nage = 15\nprint("My name is", name)\nprint("I am", age, "years old")'
                },
                {
                  id: "quiz5",
                  type: "quiz",
                  question: "What will this code print?\n```python\nx = 10\ny = 5\nprint(x + y)\n```",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "15", correct: true },
                    { id: "b", text: "105", correct: false },
                    { id: "c", text: "x + y", correct: false },
                    { id: "d", text: "10 + 5", correct: false }
                  ],
                  explanation: "Python evaluates x + y as 10 + 5, which equals 15. Then print displays the result."
                },
                {
                  id: "user-input",
                  type: "text",
                  content: "Getting User Input\n\nPrograms become more interactive when they can ask the user for information. We use the input() function for this:"
                },
                {
                  id: "code3",
                  type: "code",
                  language: "python",
                  content: 'name = input("What is your name? ")\nprint("Nice to meet you,", name)'
                },
                {
                  id: "quiz6",
                  type: "quiz",
                  question: "True or False: In Python, you must declare the type of a variable before using it",
                  quizType: "true-false",
                  correctAnswer: false,
                  explanation: "False! Python is dynamically typed, meaning you don't need to declare variable types. Python figures it out automatically."
                },
                {
                  id: "conclusion-python",
                  type: "text",
                  content: "Awesome work! You've written your first Python programs!\n\nYou now know how to:\n• Use the print() function\n• Create and use variables\n• Get input from users\n\nIn the next lesson, we'll learn about making decisions with if statements!"
                }
              ]
            },
            {
              id: "lesson2",
              title: "HTML Basics - Building Web Pages",
              sections: [
                {
                  id: "html-intro",
                  type: "text",
                  content: "Welcome to HTML!\n\nHTML stands for HyperText Markup Language. It's the foundation of every website you've ever visited. HTML tells the browser what content to display and how to structure it."
                },
                {
                  id: "html-structure",
                  type: "text",
                  content: "Basic HTML Structure\n\nEvery HTML page has a basic structure. Let's look at a simple example:"
                },
                {
                  id: "code4",
                  type: "code",
                  language: "html",
                  content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>This is my first web page.</p>\n</body>\n</html>'
                },
                {
                  id: "checkpoint5",
                  type: "checkpoint",
                  question: "Can you see how HTML uses tags with angle brackets?"
                },
                {
                  id: "tags-explanation",
                  type: "text",
                  content: "Understanding Tags\n\nHTML uses tags to mark up content. Tags are enclosed in angle brackets like <tag>.\n\nMost tags come in pairs:\n• Opening tag: <p>\n• Closing tag: </p>\n\nEverything between them is the content."
                },
                {
                  id: "common-tags",
                  type: "text",
                  content: "Common HTML Tags\n\nHere are some essential tags you'll use all the time:"
                },
                {
                  id: "code5",
                  type: "code",
                  language: "html",
                  content: '<h1>Main Heading</h1>\n<h2>Subheading</h2>\n<p>This is a paragraph.</p>\n<a href="https://example.com">This is a link</a>\n<img src="image.jpg" alt="Description">\n<ul>\n    <li>List item 1</li>\n    <li>List item 2</li>\n</ul>'
                },
                {
                  id: "quiz7",
                  type: "quiz",
                  question: "Which tag is used to create a link in HTML?",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "<a>", correct: true },
                    { id: "b", text: "<link>", correct: false },
                    { id: "c", text: "<href>", correct: false },
                    { id: "d", text: "<url>", correct: false }
                  ],
                  explanation: "The <a> tag (anchor tag) is used to create hyperlinks in HTML. The href attribute specifies the destination URL."
                },
                {
                  id: "quiz8",
                  type: "quiz",
                  question: "What does the <p> tag represent?",
                  quizType: "fill-blank",
                  correctAnswer: "paragraph",
                  explanation: "The <p> tag represents a paragraph. It's used to group sentences and text blocks together."
                },
                {
                  id: "practice-html",
                  type: "text",
                  content: "Creating Your Own Page\n\nNow you know the basics! Try creating a simple page about yourself with:\n• A heading with your name\n• A paragraph about your hobbies\n• A list of your favorite things\n\nHTML is the first step in your web development journey!"
                }
              ]
            }
          ]
        },
        {
          id: "web-dev",
          title: "Web Development",
          progress: 0,
          duration: "35 mins",
          xp: 350,
          status: "locked",
          lessons: []
        }
      ]
    },
    {
      id: "english",
      title: "English",
      icon: "📘",
      tagline: "Master communication and literary analysis",
      category: "Languages",
      progress: 0,
      topics: []
    },
    {
      id: "science",
      title: "Science",
      icon: "🔬",
      tagline: "Explore the wonders of the natural world",
      category: "STEM",
      progress: 0,
      topics: []
    },
    {
      id: "history",
      title: "History",
      icon: "📜",
      tagline: "Discover the stories that shaped our world",
      category: "Arts",
      progress: 0,
      topics: []
    },
    {
      id: "art",
      title: "Art & Design",
      icon: "🎨",
      tagline: "Express yourself through creative mediums",
      category: "Arts",
      progress: 0,
      topics: []
    }
  ],

  categories: ["All", "STEM", "Languages", "Tech", "Arts"]
};
