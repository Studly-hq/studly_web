// Course Bank V2 - Detailed scene-based course structure

export const courseBankTopics = [
  {
    id: 'html-fundamentals',
    title: 'HTML Fundamentals',
    subtitle: 'Master the building blocks of the web',
    category: 'Tech',
    difficulty: 'Beginner',
    estimatedMinutes: 45,
    icon: 'Code2',
    tags: ['HTML', 'Web Development', 'Frontend'],
    sections: [
      {
        id: 'sec-1',
        title: 'Introduction to HTML',
        order: 1,
        scenes: [
          {
            id: 'html-intro-1',
            type: 'text',
            content: `Welcome to HTML Fundamentals!

HTML stands for **HyperText Markup Language**. It's the standard language used to create web pages and structure content on the internet.

Think of HTML as the skeleton of a website. Just like how your skeleton gives your body structure, HTML gives structure to web pages.

Every website you visit—from social media platforms to online stores—uses HTML to organize and display content.`,
          },
          {
            id: 'quiz-html-1',
            type: 'quiz',
            question: 'What does HTML stand for?',
            choices: [
              { id: 'c1', text: 'HyperText Markup Language', correct: true },
              { id: 'c2', text: 'Home Tool Markup Language' },
              { id: 'c3', text: 'Hyperlinks and Text Markup Language' },
              { id: 'c4', text: 'Hyper Transfer Markup Language' }
            ],
            explanation: 'HTML stands for HyperText Markup Language. "HyperText" refers to links that connect web pages, and "Markup" refers to the tags used to structure content.',
            points: 10,
            multiSelect: false
          },
          {
            id: 'html-intro-2',
            type: 'text',
            content: `Great! Now let's understand what HTML actually does.

HTML uses **tags** to mark up content. Tags are like labels that tell the browser how to display different parts of your content.

For example:
- The \`<h1>\` tag creates a large heading
- The \`<p>\` tag creates a paragraph
- The \`<img>\` tag displays an image

Most HTML tags come in pairs: an opening tag and a closing tag. The closing tag has a forward slash before the tag name.`
          },
          {
            id: 'html-intro-code-1',
            type: 'text',
            content: `Here's a simple example:

\`\`\`html
<h1>Welcome to My Website</h1>
<p>This is my first paragraph!</p>
\`\`\`

The \`<h1>\` tag opens the heading, "Welcome to My Website" is the content, and \`</h1>\` closes the heading.

The browser reads these tags and displays them accordingly on the page.`
          }
        ]
      },
      {
        id: 'sec-2',
        title: 'HTML Document Structure',
        order: 2,
        scenes: [
          {
            id: 'html-structure-1',
            type: 'text',
            content: `Every HTML document follows a basic structure. Let's break it down:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
</html>
\`\`\`

Let's understand each part:

**\`<!DOCTYPE html>\`** - Tells the browser this is an HTML5 document

**\`<html>\`** - The root element that wraps all content

**\`<head>\`** - Contains metadata (information about the page)

**\`<title>\`** - Sets the page title shown in browser tabs

**\`<body>\`** - Contains all visible content on the page`
          },
          {
            id: 'quiz-html-structure-1',
            type: 'quiz',
            question: 'Which HTML element contains all the visible content of a web page?',
            choices: [
              { id: 'c1', text: '<head>' },
              { id: 'c2', text: '<body>', correct: true },
              { id: 'c3', text: '<html>' },
              { id: 'c4', text: '<title>' }
            ],
            explanation: 'The <body> element contains all visible content like headings, paragraphs, images, and links. The <head> contains metadata, while <html> is the root element.',
            points: 15
          },
          {
            id: 'html-structure-2',
            type: 'text',
            content: `The \`<head>\` section is super important even though it's not visible on the page.

Here's what commonly goes in the head:

\`\`\`html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Amazing Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

- **charset** tells the browser which character encoding to use
- **viewport** makes your site mobile-friendly
- **title** appears in browser tabs and search results
- **link** connects external files like CSS stylesheets`
          }
        ]
      },
      {
        id: 'sec-3',
        title: 'Common HTML Elements',
        order: 3,
        scenes: [
          {
            id: 'html-elements-1',
            type: 'text',
            content: `Let's explore the most common HTML elements you'll use daily.

**Headings** - Six levels from h1 to h6:

\`\`\`html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
\`\`\`

**Paragraphs**:

\`\`\`html
<p>This is a paragraph of text.</p>
\`\`\`

**Links**:

\`\`\`html
<a href="https://example.com">Click here</a>
\`\`\`

**Images**:

\`\`\`html
<img src="photo.jpg" alt="Description">
\`\`\``
          },
          {
            id: 'html-elements-2',
            type: 'text',
            content: `**Lists** come in two types:

Unordered lists (bullets):
\`\`\`html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
\`\`\`

Ordered lists (numbered):
\`\`\`html
<ol>
  <li>Step one</li>
  <li>Step two</li>
  <li>Step three</li>
</ol>
\`\`\`

**Divs and Spans** for grouping:
\`\`\`html
<div>Block-level container</div>
<span>Inline container</span>
\`\`\``
          },
          {
            id: 'quiz-html-elements-1',
            type: 'quiz',
            question: 'Which HTML element is used to create a hyperlink?',
            choices: [
              { id: 'c1', text: '<link>' },
              { id: 'c2', text: '<a>', correct: true },
              { id: 'c3', text: '<href>' },
              { id: 'c4', text: '<url>' }
            ],
            explanation: 'The <a> (anchor) element creates hyperlinks. The href attribute specifies the destination URL.',
            points: 10
          },
          {
            id: 'quiz-html-elements-2',
            type: 'quiz',
            question: 'Select all elements that are used for creating lists:',
            choices: [
              { id: 'c1', text: '<ul>', correct: true },
              { id: 'c2', text: '<ol>', correct: true },
              { id: 'c3', text: '<li>', correct: true },
              { id: 'c4', text: '<list>' }
            ],
            explanation: '<ul> creates unordered lists, <ol> creates ordered lists, and <li> defines list items. There is no <list> element in HTML.',
            points: 20,
            multiSelect: true
          }
        ]
      }
    ]
  },
  {
    id: 'python-basics',
    title: 'Python Programming Basics',
    subtitle: 'Start your coding journey with Python',
    category: 'Tech',
    difficulty: 'Beginner',
    estimatedMinutes: 60,
    icon: 'Code',
    tags: ['Python', 'Programming', 'Coding'],
    sections: [
      {
        id: 'py-sec-1',
        title: 'Introduction to Python',
        order: 1,
        scenes: [
          {
            id: 'py-intro-1',
            type: 'text',
            content: `Welcome to Python Programming!

Python is one of the most popular programming languages in the world. It's known for being:

- **Easy to learn** - Python's syntax reads like English
- **Versatile** - Used for web development, data science, AI, automation, and more
- **Powerful** - Despite being beginner-friendly, it's used by companies like Google, Netflix, and NASA

Python was created by Guido van Rossum and first released in 1991. Today, it's one of the fastest-growing programming languages.`
          },
          {
            id: 'quiz-py-1',
            type: 'quiz',
            question: 'What is Python primarily known for?',
            choices: [
              { id: 'c1', text: 'Being difficult to learn' },
              { id: 'c2', text: 'Having syntax similar to English', correct: true },
              { id: 'c3', text: 'Only working for web development' },
              { id: 'c4', text: 'Being the oldest programming language' }
            ],
            explanation: 'Python is famous for its readable, English-like syntax that makes it easy for beginners to learn while remaining powerful enough for advanced applications.',
            points: 10
          },
          {
            id: 'py-intro-2',
            type: 'text',
            content: `Let's write your first Python program!

\`\`\`python
print("Hello, World!")
\`\`\`

That's it! This single line prints "Hello, World!" to the screen.

Notice how clean and readable this is compared to other languages. No semicolons, no complicated syntax—just simple, clear code.

The \`print()\` function is one of Python's built-in functions. It displays text or values to the console.`
          }
        ]
      },
      {
        id: 'py-sec-2',
        title: 'Variables and Data Types',
        order: 2,
        scenes: [
          {
            id: 'py-variables-1',
            type: 'text',
            content: `In Python, **variables** store data that you can use and manipulate in your programs.

Creating a variable is simple:

\`\`\`python
name = "Alice"
age = 25
height = 5.7
is_student = True
\`\`\`

Notice:
- No need to declare variable types
- Python figures out the type automatically
- Variable names should be descriptive

Variable naming rules:
- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Case-sensitive (age and Age are different)
- Cannot use Python keywords (like print, if, for)`
          },
          {
            id: 'py-variables-2',
            type: 'text',
            content: `Python has several basic data types:

**Strings** - Text data:
\`\`\`python
name = "Python"
message = 'Hello World'
\`\`\`

**Integers** - Whole numbers:
\`\`\`python
age = 25
year = 2024
\`\`\`

**Floats** - Decimal numbers:
\`\`\`python
price = 19.99
temperature = 36.5
\`\`\`

**Booleans** - True or False:
\`\`\`python
is_active = True
has_account = False
\`\`\``
          },
          {
            id: 'quiz-py-variables-1',
            type: 'quiz',
            question: 'Which of these is a valid Python variable name?',
            choices: [
              { id: 'c1', text: '2nd_place' },
              { id: 'c2', text: 'user_age', correct: true },
              { id: 'c3', text: 'for' },
              { id: 'c4', text: 'user-name' }
            ],
            explanation: 'user_age is valid. Variable names cannot start with numbers (2nd_place), cannot be keywords (for), and cannot contain hyphens (user-name).',
            points: 15
          },
          {
            id: 'py-variables-3',
            type: 'text',
            content: `You can perform operations with variables:

\`\`\`python
# Numbers
x = 10
y = 3
sum = x + y        # 13
difference = x - y  # 7
product = x * y     # 30
quotient = x / y    # 3.333...

# Strings
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name  # "John Doe"

# You can also multiply strings!
laugh = "ha" * 3  # "hahaha"
\`\`\`

Notice the **#** symbol? That's a comment. Python ignores anything after # on that line.`
          },
          {
            id: 'quiz-py-operations-1',
            type: 'quiz',
            question: 'What will be the result of: "Hi" * 3',
            choices: [
              { id: 'c1', text: 'HiHiHi', correct: true },
              { id: 'c2', text: 'Hi3' },
              { id: 'c3', text: 'Error' },
              { id: 'c4', text: '9' }
            ],
            explanation: 'In Python, multiplying a string by a number repeats that string. "Hi" * 3 produces "HiHiHi".',
            points: 15
          }
        ]
      },
      {
        id: 'py-sec-3',
        title: 'User Input and Output',
        order: 3,
        scenes: [
          {
            id: 'py-io-1',
            type: 'text',
            content: `Python programs can interact with users through input and output.

**Output** - We've already used \`print()\`:

\`\`\`python
print("Hello!")
print("Your score is:", 95)

# You can print multiple values
name = "Alice"
age = 25
print("Name:", name, "Age:", age)
\`\`\`

**Input** - Get data from the user:

\`\`\`python
name = input("What's your name? ")
print("Hello,", name)
\`\`\`

The \`input()\` function always returns a string, even if the user types a number!`
          },
          {
            id: 'py-io-2',
            type: 'text',
            content: `If you need to work with numbers from user input, convert them:

\`\`\`python
# Get user's age as a number
age_text = input("How old are you? ")
age = int(age_text)  # Convert to integer

# Or do it in one line
age = int(input("How old are you? "))

# For decimal numbers, use float()
price = float(input("Enter price: "))
\`\`\`

**Type conversion functions:**
- \`int()\` - Convert to integer
- \`float()\` - Convert to decimal
- \`str()\` - Convert to string`
          },
          {
            id: 'quiz-py-io-1',
            type: 'quiz',
            question: 'What does the input() function return?',
            choices: [
              { id: 'c1', text: 'Always a string', correct: true },
              { id: 'c2', text: 'Always a number' },
              { id: 'c3', text: 'Depends on what user types' },
              { id: 'c4', text: 'Always an integer' }
            ],
            explanation: 'The input() function always returns a string, regardless of what the user types. You need to convert it using int() or float() if you want to use it as a number.',
            points: 15
          }
        ]
      }
    ]
  },
  {
    id: 'css-styling',
    title: 'CSS Styling Essentials',
    subtitle: 'Make your websites beautiful',
    category: 'Tech',
    difficulty: 'Beginner',
    estimatedMinutes: 50,
    icon: 'Palette',
    tags: ['CSS', 'Web Design', 'Frontend'],
    sections: [
      {
        id: 'css-sec-1',
        title: 'Introduction to CSS',
        order: 1,
        scenes: [
          {
            id: 'css-intro-1',
            type: 'text',
            content: `Welcome to CSS!

**CSS** stands for **Cascading Style Sheets**. While HTML provides structure to web pages, CSS makes them look beautiful.

Think of it this way:
- HTML is the **skeleton** (structure)
- CSS is the **skin and clothes** (appearance)
- JavaScript is the **muscles** (behavior)

With CSS, you can:
- Change colors, fonts, and sizes
- Create layouts and position elements
- Add animations and transitions
- Make responsive designs for different screen sizes`
          },
          {
            id: 'quiz-css-1',
            type: 'quiz',
            question: 'What does CSS stand for?',
            choices: [
              { id: 'c1', text: 'Computer Style Sheets' },
              { id: 'c2', text: 'Cascading Style Sheets', correct: true },
              { id: 'c3', text: 'Creative Style System' },
              { id: 'c4', text: 'Colorful Style Sheets' }
            ],
            explanation: 'CSS stands for Cascading Style Sheets. "Cascading" refers to how styles can override each other based on specificity and source order.',
            points: 10
          },
          {
            id: 'css-intro-2',
            type: 'text',
            content: `CSS follows a simple pattern:

\`\`\`css
selector {
  property: value;
}
\`\`\`

For example:

\`\`\`css
h1 {
  color: blue;
  font-size: 32px;
}

p {
  color: gray;
  line-height: 1.6;
}
\`\`\`

- **Selector** - What element to style (h1, p, etc.)
- **Property** - What to change (color, font-size, etc.)
- **Value** - How to change it (blue, 32px, etc.)

Each declaration ends with a semicolon, and multiple declarations go inside curly braces.`
          }
        ]
      },
      {
        id: 'css-sec-2',
        title: 'Selectors and Colors',
        order: 2,
        scenes: [
          {
            id: 'css-selectors-1',
            type: 'text',
            content: `CSS has different types of selectors:

**Element Selector** - Targets all elements of that type:
\`\`\`css
p {
  color: black;
}
\`\`\`

**Class Selector** - Targets elements with a specific class:
\`\`\`css
.highlight {
  background-color: yellow;
}
\`\`\`

**ID Selector** - Targets a single element with a specific ID:
\`\`\`css
#header {
  font-size: 24px;
}
\`\`\`

In HTML:
\`\`\`html
<p class="highlight">This has a class</p>
<div id="header">This has an ID</div>
\`\`\``
          },
          {
            id: 'quiz-css-selectors-1',
            type: 'quiz',
            question: 'Which selector is used to target elements with a specific class?',
            choices: [
              { id: 'c1', text: '#className' },
              { id: 'c2', text: '.className', correct: true },
              { id: 'c3', text: 'className' },
              { id: 'c4', text: '*className' }
            ],
            explanation: 'The dot (.) is used for class selectors. The hash (#) is for IDs, and no symbol is for element selectors.',
            points: 15
          },
          {
            id: 'css-colors-1',
            type: 'text',
            content: `CSS offers multiple ways to specify colors:

**Named Colors:**
\`\`\`css
color: red;
background-color: blue;
\`\`\`

**Hex Codes:**
\`\`\`css
color: #FF5733;  /* Red-orange */
background-color: #000000;  /* Black */
\`\`\`

**RGB:**
\`\`\`css
color: rgb(255, 87, 51);
background-color: rgba(0, 0, 0, 0.5);  /* Semi-transparent */
\`\`\`

**HSL:**
\`\`\`css
color: hsl(9, 100%, 60%);
\`\`\`

The 'a' in rgba and hsla stands for alpha (transparency), ranging from 0 (fully transparent) to 1 (fully opaque).`
          }
        ]
      }
    ]
  },
  {
    id: 'algebra-basics',
    title: 'Algebra Fundamentals',
    subtitle: 'Master equations and variables',
    category: 'STEM',
    difficulty: 'Beginner',
    estimatedMinutes: 55,
    icon: 'Calculator',
    tags: ['Math', 'Algebra', 'Equations'],
    sections: [
      {
        id: 'alg-sec-1',
        title: 'Understanding Variables',
        order: 1,
        scenes: [
          {
            id: 'alg-intro-1',
            type: 'text',
            content: `Welcome to Algebra!

Algebra is a branch of mathematics that uses **variables** (letters) to represent numbers. Instead of always working with specific numbers, we can use letters like x, y, or z.

Why is this useful?

- Solve real-world problems
- Find unknown values
- Create general formulas
- Model relationships between quantities

Think of variables as **placeholders** for numbers we don't know yet or numbers that can change.`
          },
          {
            id: 'alg-intro-2',
            type: 'text',
            content: `Let's start simple. In arithmetic, you might see:

**5 + 3 = 8**

In algebra, we might write:

**x + 3 = 8**

Here, x is a variable representing an unknown number. Our job is to find what value of x makes this equation true.

By subtracting 3 from both sides:
**x + 3 - 3 = 8 - 3**
**x = 5**

So x equals 5! We can always check by substituting back: 5 + 3 = 8 ✓`
          },
          {
            id: 'quiz-alg-1',
            type: 'quiz',
            question: 'What is a variable in algebra?',
            choices: [
              { id: 'c1', text: 'A letter that represents an unknown number', correct: true },
              { id: 'c2', text: 'Always equal to zero' },
              { id: 'c3', text: 'A type of calculator' },
              { id: 'c4', text: 'A math operation' }
            ],
            explanation: 'A variable is a symbol (usually a letter) that represents an unknown or changing number in mathematical expressions and equations.',
            points: 10
          },
          {
            id: 'quiz-alg-2',
            type: 'quiz',
            question: 'Solve for x: x + 7 = 12',
            choices: [
              { id: 'c1', text: 'x = 19' },
              { id: 'c2', text: 'x = 5', correct: true },
              { id: 'c3', text: 'x = 7' },
              { id: 'c4', text: 'x = 12' }
            ],
            explanation: 'To solve x + 7 = 12, subtract 7 from both sides: x = 12 - 7 = 5',
            points: 20
          }
        ]
      },
      {
        id: 'alg-sec-2',
        title: 'Basic Operations with Variables',
        order: 2,
        scenes: [
          {
            id: 'alg-ops-1',
            type: 'text',
            content: `Variables follow the same arithmetic rules as numbers.

**Addition:**
**x + 5** means "x plus 5"
**3 + y** means "3 plus y"

**Subtraction:**
**x - 2** means "x minus 2"
**10 - y** means "10 minus y"

**Multiplication:**
**2x** means "2 times x" (we don't need the × symbol)
**xy** means "x times y"
**3(x + 2)** means "3 times the quantity (x + 2)"

**Division:**
**x/4** means "x divided by 4"
**y ÷ 3** can also be written as **y/3**`
          },
          {
            id: 'alg-ops-2',
            type: 'text',
            content: `**Like terms** have the same variable raised to the same power.

You can combine like terms:
- **3x + 5x = 8x** ✓
- **2y + 7y = 9y** ✓

You cannot combine unlike terms:
- **3x + 5y** stays as is ✗
- **2x + 3** stays as is ✗

Think of it like fruits: 3 apples + 5 apples = 8 apples, but 3 apples + 5 oranges = 3 apples and 5 oranges!`
          },
          {
            id: 'quiz-alg-ops-1',
            type: 'quiz',
            question: 'Simplify: 4x + 3x',
            choices: [
              { id: 'c1', text: '7x', correct: true },
              { id: 'c2', text: '7x²' },
              { id: 'c3', text: '12x' },
              { id: 'c4', text: '4x + 3x (cannot simplify)' }
            ],
            explanation: 'Since 4x and 3x are like terms, we add the coefficients: 4 + 3 = 7, so 4x + 3x = 7x',
            points: 15
          }
        ]
      }
    ]
  },
  {
    id: 'react-intro',
    title: 'Introduction to React',
    subtitle: 'Build modern user interfaces',
    category: 'Tech',
    difficulty: 'Intermediate',
    estimatedMinutes: 70,
    icon: 'Cpu',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    sections: [
      {
        id: 'react-sec-1',
        title: 'What is React?',
        order: 1,
        scenes: [
          {
            id: 'react-intro-1',
            type: 'text',
            content: `Welcome to React!

**React** is a JavaScript library for building user interfaces, created by Facebook (now Meta) and released in 2013.

Why is React so popular?

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Design simple views for each state, React updates efficiently
- **Learn Once, Write Anywhere**: Use on web, mobile (React Native), desktop, VR
- **Huge Ecosystem**: Massive community, tons of libraries and tools

React powers many major websites: Facebook, Instagram, Netflix, Airbnb, and thousands more.`
          },
          {
            id: 'quiz-react-1',
            type: 'quiz',
            question: 'What type of library is React?',
            choices: [
              { id: 'c1', text: 'A UI library for building user interfaces', correct: true },
              { id: 'c2', text: 'A database management system' },
              { id: 'c3', text: 'A CSS framework' },
              { id: 'c4', text: 'A server-side language' }
            ],
            explanation: 'React is a JavaScript library specifically designed for building user interfaces, particularly single-page applications.',
            points: 10
          },
          {
            id: 'react-intro-2',
            type: 'text',
            content: `React uses **JSX** - a syntax extension that looks like HTML but works in JavaScript.

Here's a simple React component:

\`\`\`jsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
\`\`\`

Notice:
- It's a JavaScript function
- It returns what looks like HTML (but it's JSX)
- JSX gets transformed into JavaScript

You can use this component like:

\`\`\`jsx
<Welcome />
\`\`\`

Components are reusable, composable building blocks of your UI!`
          }
        ]
      }
    ]
  }
];

// Helper function to get topic by ID
export const getTopicById = (topicId) => {
  return courseBankTopics.find(topic => topic.id === topicId);
};

// Helper function to filter topics by category
export const getTopicsByCategory = (category) => {
  if (category === 'All') return courseBankTopics;
  return courseBankTopics.filter(topic => topic.category === category);
};

// Helper function to search topics
export const searchTopics = (query) => {
  const lowerQuery = query.toLowerCase();
  return courseBankTopics.filter(topic =>
    topic.title.toLowerCase().includes(lowerQuery) ||
    topic.subtitle.toLowerCase().includes(lowerQuery) ||
    topic.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Categories for filtering
export const categories = ['All', 'STEM', 'Tech', 'Languages', 'Arts'];
