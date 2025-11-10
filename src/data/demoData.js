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
      id: "python",
      title: "Python Programming",
      icon: "🐍",
      tagline: "Master Python from basics to advanced applications",
      category: "Tech",
      progress: 30,
      topics: [
        {
          id: "python-fundamentals",
          title: "Python Fundamentals",
          progress: 40,
          duration: "25 mins",
          xp: 250,
          status: "unlocked",
          lessons: [
            {
              id: "lesson1",
              title: "Your First Python Program",
              sections: [
                {
                  id: "python-intro",
                  type: "text",
                  content: "Welcome to Python Programming!\n\nPython is one of the most popular programming languages in the world. Created by Guido van Rossum in 1991, it's designed to be readable and straightforward.\n\nPython is used for:\n• Web development (Instagram, Spotify, Netflix)\n• Data science and machine learning (AI research)\n• Automation and scripting\n• Game development\n• Scientific computing\n\nLet's write your first Python program together!"
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
                  content: "Let's break this down:\n\nThe word 'print' is a built-in function that tells Python to display something on the screen. The text inside the quotes is what will be displayed.\n\nIn Python, anything inside quotes (single or double) is called a string. Strings represent text data."
                },
                {
                  id: "checkpoint4",
                  type: "checkpoint",
                  question: "Does this make sense? Ready to try more?"
                },
                {
                  id: "variables-python",
                  type: "text",
                  content: "Variables in Python\n\nJust like in algebra, we use variables in programming to store values. In Python, creating a variable is super easy - you don't need to declare its type!\n\nHere are different types of data you can store:"
                },
                {
                  id: "code2",
                  type: "code",
                  language: "python",
                  content: '# Strings (text)\nname = "Alex"\nfavorite_color = "blue"\n\n# Integers (whole numbers)\nage = 15\nscore = 100\n\n# Floats (decimal numbers)\nheight = 5.7\npi = 3.14159\n\n# Booleans (True or False)\nis_student = True\nhas_license = False\n\n# Using variables\nprint("My name is", name)\nprint("I am", age, "years old")\nprint("My height is", height, "feet")'
                },
                {
                  id: "naming-rules",
                  type: "text",
                  content: "Variable Naming Rules\n\nIn Python, variable names must follow these rules:\n• Start with a letter or underscore\n• Can contain letters, numbers, and underscores\n• Cannot contain spaces or special characters\n• Are case-sensitive (age and Age are different)\n• Cannot be Python keywords (like print, if, for)\n\nGood examples: my_age, firstName, score_2, _temp\nBad examples: 2nd_place, my-name, class, for"
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
                  id: "data-types",
                  type: "text",
                  content: "Understanding Data Types\n\nPython automatically determines the type of data you're storing. You can check the type using the type() function:"
                },
                {
                  id: "code3",
                  type: "code",
                  language: "python",
                  content: 'name = "Alex"\nage = 15\nheight = 5.7\nis_student = True\n\nprint(type(name))      # <class \'str\'>\nprint(type(age))       # <class \'int\'>\nprint(type(height))    # <class \'float\'>\nprint(type(is_student)) # <class \'bool\'>'
                },
                {
                  id: "user-input",
                  type: "text",
                  content: "Getting User Input\n\nPrograms become more interactive when they can ask the user for information. We use the input() function for this:"
                },
                {
                  id: "code4",
                  type: "code",
                  language: "python",
                  content: 'name = input("What is your name? ")\nprint("Nice to meet you,", name)\n\n# Note: input() always returns a string\nage = input("How old are you? ")\nprint("Type of age:", type(age))  # <class \'str\'>\n\n# To use it as a number, convert it\nage = int(input("How old are you? "))\nprint("Next year you\'ll be", age + 1)'
                },
                {
                  id: "quiz6",
                  type: "quiz",
                  question: "True or False: In Python, you must declare the type of a variable before using it",
                  quizType: "true-false",
                  correctAnswer: false,
                  explanation: "False! Python is dynamically typed, meaning you don't need to declare variable types. Python figures it out automatically based on the value you assign."
                },
                {
                  id: "comments",
                  type: "text",
                  content: "Writing Comments\n\nComments are notes in your code that Python ignores. They help you and others understand what your code does:"
                },
                {
                  id: "code5",
                  type: "code",
                  language: "python",
                  content: '# This is a single-line comment\n\n"""\nThis is a multi-line comment.\nYou can write several lines here.\nUseful for longer explanations.\n"""\n\nage = 15  # You can also put comments at the end of lines'
                },
                {
                  id: "conclusion-python",
                  type: "text",
                  content: "Awesome work! You've written your first Python programs!\n\nYou now know how to:\n• Use the print() function to display output\n• Create and use variables of different types\n• Get input from users with input()\n• Convert between data types\n• Write comments to document your code\n\nIn the next lesson, we'll learn about making decisions with if statements!"
                }
              ]
            },
            {
              id: "lesson2",
              title: "Python Operators and Expressions",
              sections: [
                {
                  id: "operators-intro",
                  type: "text",
                  content: "Understanding Operators\n\nOperators are special symbols that perform operations on values and variables. Python has several types of operators that you'll use constantly."
                },
                {
                  id: "arithmetic-operators",
                  type: "text",
                  content: "Arithmetic Operators\n\nThese are used for mathematical calculations:"
                },
                {
                  id: "code6",
                  type: "code",
                  language: "python",
                  content: '# Basic arithmetic\na = 10\nb = 3\n\nprint(a + b)   # Addition: 13\nprint(a - b)   # Subtraction: 7\nprint(a * b)   # Multiplication: 30\nprint(a / b)   # Division: 3.333...\nprint(a // b)  # Floor division: 3\nprint(a % b)   # Modulus (remainder): 1\nprint(a ** b)  # Exponentiation: 1000'
                },
                {
                  id: "checkpoint5",
                  type: "checkpoint",
                  question: "Do you understand the difference between / and // operators?"
                },
                {
                  id: "comparison-operators",
                  type: "text",
                  content: "Comparison Operators\n\nThese compare two values and return True or False:"
                },
                {
                  id: "code7",
                  type: "code",
                  language: "python",
                  content: 'x = 10\ny = 20\n\nprint(x == y)  # Equal to: False\nprint(x != y)  # Not equal to: True\nprint(x < y)   # Less than: True\nprint(x > y)   # Greater than: False\nprint(x <= y)  # Less than or equal to: True\nprint(x >= y)  # Greater than or equal to: False'
                },
                {
                  id: "logical-operators",
                  type: "text",
                  content: "Logical Operators\n\nThese combine multiple conditions:"
                },
                {
                  id: "code8",
                  type: "code",
                  language: "python",
                  content: 'age = 16\nhas_license = False\n\n# AND - both conditions must be True\nprint(age >= 16 and has_license)  # False\n\n# OR - at least one condition must be True\nprint(age >= 16 or has_license)   # True\n\n# NOT - inverts the boolean value\nprint(not has_license)            # True'
                },
                {
                  id: "quiz7",
                  type: "quiz",
                  question: "What is the result of: 17 % 5",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "2", correct: true },
                    { id: "b", text: "3", correct: false },
                    { id: "c", text: "3.4", correct: false },
                    { id: "d", text: "12", correct: false }
                  ],
                  explanation: "The modulus operator (%) returns the remainder after division. 17 divided by 5 is 3 with a remainder of 2."
                },
                {
                  id: "string-operations",
                  type: "text",
                  content: "String Operations\n\nYou can do interesting things with strings in Python:"
                },
                {
                  id: "code9",
                  type: "code",
                  language: "python",
                  content: '# Concatenation (joining strings)\nfirst_name = "John"\nlast_name = "Doe"\nfull_name = first_name + " " + last_name\nprint(full_name)  # "John Doe"\n\n# Repetition\nprint("Ha" * 3)  # "HaHaHa"\n\n# String length\nname = "Python"\nprint(len(name))  # 6\n\n# String indexing (starts at 0)\nprint(name[0])   # "P"\nprint(name[-1])  # "n" (last character)'
                },
                {
                  id: "quiz8",
                  type: "quiz",
                  question: "What does this print?\n```python\nword = \"Code\"\nprint(word * 2)\n```",
                  quizType: "fill-blank",
                  correctAnswer: "CodeCode",
                  explanation: "The * operator repeats strings. 'Code' * 2 produces 'CodeCode'."
                },
                {
                  id: "practice-operators",
                  type: "text",
                  content: "Excellent! You now understand how to:\n• Perform arithmetic operations\n• Compare values\n• Combine conditions with logical operators\n• Manipulate strings\n\nThese operators are the building blocks of all Python programs!"
                }
              ]
            }
          ]
        },
        {
          id: "python-control-flow",
          title: "Python Control Flow",
          progress: 25,
          duration: "30 mins",
          xp: 300,
          status: "unlocked",
          lessons: [
            {
              id: "lesson1",
              title: "Making Decisions with If Statements",
              sections: [
                {
                  id: "if-intro",
                  type: "text",
                  content: "Control Flow with If Statements\n\nPrograms need to make decisions based on different conditions. That's where if statements come in!\n\nAn if statement lets your code execute different blocks depending on whether a condition is True or False."
                },
                {
                  id: "basic-if",
                  type: "text",
                  content: "Basic If Statement\n\nHere's the simplest form:"
                },
                {
                  id: "code10",
                  type: "code",
                  language: "python",
                  content: 'age = 16\n\nif age >= 16:\n    print("You can drive!")\n    print("Be safe on the road.")\n\nprint("This always prints")'
                },
                {
                  id: "indentation",
                  type: "text",
                  content: "Important: Indentation!\n\nPython uses indentation (spaces) to determine which code belongs to the if statement. Most programmers use 4 spaces.\n\nIndented code only runs if the condition is True."
                },
                {
                  id: "checkpoint6",
                  type: "checkpoint",
                  question: "Do you understand why indentation matters in Python?"
                },
                {
                  id: "if-else",
                  type: "text",
                  content: "If-Else Statements\n\nWhat if you want to do one thing when a condition is True, and something else when it's False?"
                },
                {
                  id: "code11",
                  type: "code",
                  language: "python",
                  content: 'temperature = 75\n\nif temperature > 80:\n    print("It\'s hot outside!")\n    print("Drink plenty of water.")\nelse:\n    print("The weather is nice.")\n    print("Enjoy your day!")'
                },
                {
                  id: "elif",
                  type: "text",
                  content: "Multiple Conditions with Elif\n\nWhen you have more than two possibilities, use elif (short for 'else if'):"
                },
                {
                  id: "code12",
                  type: "code",
                  language: "python",
                  content: 'score = 85\n\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelif score >= 60:\n    grade = "D"\nelse:\n    grade = "F"\n\nprint(f"Your grade is: {grade}")'
                },
                {
                  id: "quiz9",
                  type: "quiz",
                  question: "What will this code print if age = 15?\n```python\nif age >= 18:\n    print('Adult')\nelif age >= 13:\n    print('Teen')\nelse:\n    print('Child')\n```",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "Teen", correct: true },
                    { id: "b", text: "Adult", correct: false },
                    { id: "c", text: "Child", correct: false },
                    { id: "d", text: "Nothing", correct: false }
                  ],
                  explanation: "15 is not >= 18, but it is >= 13, so the elif condition is True and 'Teen' is printed."
                },
                {
                  id: "nested-if",
                  type: "text",
                  content: "Nested If Statements\n\nYou can put if statements inside other if statements:"
                },
                {
                  id: "code13",
                  type: "code",
                  language: "python",
                  content: 'age = 20\nhas_ticket = True\n\nif age >= 18:\n    print("You\'re old enough.")\n    if has_ticket:\n        print("Welcome to the concert!")\n    else:\n        print("Please buy a ticket first.")\nelse:\n    print("Sorry, you must be 18 or older.")'
                },
                {
                  id: "quiz10",
                  type: "quiz",
                  question: "True or False: You can have multiple elif statements in a single if-elif-else block",
                  quizType: "true-false",
                  correctAnswer: true,
                  explanation: "True! You can have as many elif statements as you need to check multiple conditions."
                }
              ]
            },
            {
              id: "lesson2",
              title: "Loops in Python",
              sections: [
                {
                  id: "loops-intro",
                  type: "text",
                  content: "Introduction to Loops\n\nLoops let you repeat code multiple times without writing it over and over. Python has two main types of loops: for loops and while loops."
                },
                {
                  id: "for-loop",
                  type: "text",
                  content: "For Loops\n\nUse for loops when you know how many times you want to repeat something:"
                },
                {
                  id: "code14",
                  type: "code",
                  language: "python",
                  content: '# Loop through a range of numbers\nfor i in range(5):\n    print(f"Count: {i}")\n# Prints: 0, 1, 2, 3, 4\n\n# Loop through a list\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(f"I like {fruit}")\n\n# Loop through a string\nfor letter in "Python":\n    print(letter)'
                },
                {
                  id: "range-function",
                  type: "text",
                  content: "The range() Function\n\nrange() generates a sequence of numbers:\n\n• range(5) → 0, 1, 2, 3, 4\n• range(1, 6) → 1, 2, 3, 4, 5\n• range(0, 10, 2) → 0, 2, 4, 6, 8 (steps by 2)"
                },
                {
                  id: "code15",
                  type: "code",
                  language: "python",
                  content: '# Multiplication table\nnumber = 5\nfor i in range(1, 11):\n    result = number * i\n    print(f"{number} x {i} = {result}")'
                },
                {
                  id: "checkpoint7",
                  type: "checkpoint",
                  question: "Can you see how loops save you from writing repetitive code?"
                },
                {
                  id: "while-loop",
                  type: "text",
                  content: "While Loops\n\nUse while loops when you want to repeat something until a condition becomes False:"
                },
                {
                  id: "code16",
                  type: "code",
                  language: "python",
                  content: '# Count down\ncount = 5\nwhile count > 0:\n    print(count)\n    count = count - 1  # Same as: count -= 1\nprint("Blast off!")\n\n# User input validation\npassword = ""\nwhile password != "python123":\n    password = input("Enter password: ")\nprint("Access granted!")'
                },
                {
                  id: "break-continue",
                  type: "text",
                  content: "Break and Continue\n\nThese keywords give you more control over loops:"
                },
                {
                  id: "code17",
                  type: "code",
                  language: "python",
                  content: '# break - exits the loop immediately\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)\n# Prints: 0, 1, 2, 3, 4\n\n# continue - skips to the next iteration\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)\n# Prints: 0, 1, 3, 4'
                },
                {
                  id: "quiz11",
                  type: "quiz",
                  question: "How many times will this loop run?\n```python\nfor i in range(3, 8):\n    print(i)\n```",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "5", correct: true },
                    { id: "b", text: "3", correct: false },
                    { id: "c", text: "8", correct: false },
                    { id: "d", text: "6", correct: false }
                  ],
                  explanation: "range(3, 8) generates: 3, 4, 5, 6, 7. That's 5 numbers, so the loop runs 5 times."
                },
                {
                  id: "nested-loops",
                  type: "text",
                  content: "Nested Loops\n\nYou can put loops inside other loops:"
                },
                {
                  id: "code18",
                  type: "code",
                  language: "python",
                  content: '# Create a pattern\nfor i in range(1, 4):\n    for j in range(i):\n        print("*", end="")\n    print()  # New line\n\n# Output:\n# *\n# **\n# ***'
                },
                {
                  id: "practice-loops",
                  type: "text",
                  content: "Amazing! You now know how to:\n• Use for loops to iterate over sequences\n• Use while loops for condition-based repetition\n• Control loop execution with break and continue\n• Create nested loops for complex patterns\n\nLoops are essential for automating repetitive tasks!"
                }
              ]
            }
          ]
        },
        {
          id: "python-data-structures",
          title: "Python Data Structures",
          progress: 15,
          duration: "35 mins",
          xp: 350,
          status: "unlocked",
          lessons: [
            {
              id: "lesson1",
              title: "Lists - Dynamic Arrays",
              sections: [
                {
                  id: "lists-intro",
                  type: "text",
                  content: "Introduction to Lists\n\nLists are one of Python's most versatile data structures. They store multiple items in a single variable and can hold different types of data.\n\nThink of a list as a container that can hold any number of items, and you can modify it anytime!"
                },
                {
                  id: "creating-lists",
                  type: "text",
                  content: "Creating Lists\n\nLists are created using square brackets []:"
                },
                {
                  id: "code19",
                  type: "code",
                  language: "python",
                  content: '# Empty list\nmy_list = []\n\n# List of numbers\nnumbers = [1, 2, 3, 4, 5]\n\n# List of strings\nfruits = ["apple", "banana", "cherry"]\n\n# Mixed types (not common but possible)\nmixed = [1, "hello", 3.14, True]\n\n# List of lists (nested)\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]'
                },
                {
                  id: "accessing-elements",
                  type: "text",
                  content: "Accessing List Elements\n\nUse indexing to access elements. Remember: Python indexes start at 0!"
                },
                {
                  id: "code20",
                  type: "code",
                  language: "python",
                  content: 'fruits = ["apple", "banana", "cherry", "date", "elderberry"]\n\n# Positive indexing\nprint(fruits[0])   # "apple"\nprint(fruits[2])   # "cherry"\n\n# Negative indexing (from the end)\nprint(fruits[-1])  # "elderberry"\nprint(fruits[-2])  # "date"\n\n# Slicing [start:end:step]\nprint(fruits[1:4])   # ["banana", "cherry", "date"]\nprint(fruits[:3])    # ["apple", "banana", "cherry"]\nprint(fruits[2:])    # ["cherry", "date", "elderberry"]\nprint(fruits[::2])   # ["apple", "cherry", "elderberry"]'
                },
                {
                  id: "checkpoint8",
                  type: "checkpoint",
                  question: "Do you understand how list indexing and slicing work?"
                },
                {
                  id: "modifying-lists",
                  type: "text",
                  content: "Modifying Lists\n\nLists are mutable - you can change them after creation:"
                },
                {
                  id: "code21",
                  type: "code",
                  language: "python",
                  content: 'numbers = [1, 2, 3, 4, 5]\n\n# Change an element\nnumbers[0] = 10\nprint(numbers)  # [10, 2, 3, 4, 5]\n\n# Add elements\nnumbers.append(6)        # Add to end: [10, 2, 3, 4, 5, 6]\nnumbers.insert(0, 0)     # Insert at index: [0, 10, 2, 3, 4, 5, 6]\n\n# Remove elements\nnumbers.remove(10)       # Remove by value\npopped = numbers.pop()   # Remove and return last element\ndel numbers[0]           # Delete by index\n\n# Extend with another list\nnumbers.extend([7, 8, 9])'
                },
                {
                  id: "list-methods",
                  type: "text",
                  content: "Common List Methods"
                },
                {
                  id: "code22",
                  type: "code",
                  language: "python",
                  content: 'numbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\nprint(len(numbers))        # Length: 8\nprint(numbers.count(1))    # Count occurrences: 2\nprint(numbers.index(5))    # Find index: 4\n\nnumbers.sort()             # Sort in place\nprint(numbers)             # [1, 1, 2, 3, 4, 5, 6, 9]\n\nnumbers.reverse()          # Reverse in place\nprint(numbers)             # [9, 6, 5, 4, 3, 2, 1, 1]\n\ncopy = numbers.copy()      # Create a copy\nnumbers.clear()            # Remove all elements'
                },
                {
                  id: "quiz12",
                  type: "quiz",
                  question: "What does this code output?\n```python\nfruits = ['apple', 'banana', 'cherry']\nfruits.append('date')\nprint(fruits[3])\n```",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "date", correct: true },
                    { id: "b", text: "cherry", correct: false },
                    { id: "c", text: "banana", correct: false },
                    { id: "d", text: "Error", correct: false }
                  ],
                  explanation: "append() adds 'date' to the end. The list becomes ['apple', 'banana', 'cherry', 'date']. Index 3 is 'date'."
                },
                {
                  id: "list-comprehensions",
                  type: "text",
                  content: "List Comprehensions\n\nA powerful way to create lists in one line:"
                },
                {
                  id: "code23",
                  type: "code",
                  language: "python",
                  content: '# Traditional way\nsquares = []\nfor i in range(10):\n    squares.append(i ** 2)\n\n# List comprehension way\nsquares = [i ** 2 for i in range(10)]\nprint(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\n\n# With condition\nevens = [i for i in range(20) if i % 2 == 0]\nprint(evens)    # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\n\n# Transform strings\nfruits = ["apple", "banana", "cherry"]\nupper_fruits = [fruit.upper() for fruit in fruits]\nprint(upper_fruits)  # ["APPLE", "BANANA", "CHERRY"]'
                },
                {
                  id: "quiz13",
                  type: "quiz",
                  question: "True or False: Lists in Python can contain elements of different data types",
                  quizType: "true-false",
                  correctAnswer: true,
                  explanation: "True! Python lists can contain mixed types: [1, 'hello', 3.14, True]. However, it's usually better to keep lists homogeneous for clarity."
                }
              ]
            },
            {
              id: "lesson2",
              title: "Dictionaries and Tuples",
              sections: [
                {
                  id: "dict-intro",
                  type: "text",
                  content: "Dictionaries - Key-Value Pairs\n\nDictionaries store data in key-value pairs. They're like real dictionaries where you look up a word (key) to find its definition (value).\n\nDictionaries are incredibly useful for organizing related data!"
                },
                {
                  id: "creating-dicts",
                  type: "text",
                  content: "Creating Dictionaries"
                },
                {
                  id: "code24",
                  type: "code",
                  language: "python",
                  content: '# Empty dictionary\nmy_dict = {}\n\n# Dictionary with data\nstudent = {\n    "name": "Alex",\n    "age": 15,\n    "grade": "10th",\n    "gpa": 3.8\n}\n\n# Accessing values\nprint(student["name"])    # "Alex"\nprint(student.get("age")) # 15\n\n# get() is safer - returns None if key doesn\'t exist\nprint(student.get("phone"))  # None\nprint(student.get("phone", "Not available"))  # "Not available"'
                },
                {
                  id: "modifying-dicts",
                  type: "text",
                  content: "Modifying Dictionaries"
                },
                {
                  id: "code25",
                  type: "code",
                  language: "python",
                  content: 'student = {"name": "Alex", "age": 15}\n\n# Add or update\nstudent["grade"] = "10th"     # Add new key\nstudent["age"] = 16           # Update existing\n\n# Remove items\ndel student["grade"]          # Delete by key\nage = student.pop("age")      # Remove and return value\n\n# Update multiple items\nstudent.update({"age": 15, "gpa": 3.8, "school": "Central High"})\n\n# Check if key exists\nif "name" in student:\n    print("Name is present")'
                },
                {
                  id: "checkpoint9",
                  type: "checkpoint",
                  question: "Can you see how dictionaries are different from lists?"
                },
                {
                  id: "dict-methods",
                  type: "text",
                  content: "Dictionary Methods and Iteration"
                },
                {
                  id: "code26",
                  type: "code",
                  language: "python",
                  content: 'student = {"name": "Alex", "age": 15, "grade": "10th"}\n\n# Get all keys, values, or items\nprint(student.keys())    # dict_keys([\'name\', \'age\', \'grade\'])\nprint(student.values())  # dict_values([\'Alex\', 15, \'10th\'])\nprint(student.items())   # dict_items([(\'name\', \'Alex\'), ...])\n\n# Iterate through dictionary\nfor key in student:\n    print(f"{key}: {student[key]}")\n\n# Better way to iterate\nfor key, value in student.items():\n    print(f"{key}: {value}")'
                },
                {
                  id: "quiz14",
                  type: "quiz",
                  question: "What will this print?\n```python\nscores = {'math': 85, 'science': 90}\nscores['english'] = 88\nprint(len(scores))\n```",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "3", correct: true },
                    { id: "b", text: "2", correct: false },
                    { id: "c", text: "4", correct: false },
                    { id: "d", text: "Error", correct: false }
                  ],
                  explanation: "The dictionary starts with 2 items. Adding 'english' makes it 3 items total. len() returns 3."
                },
                {
                  id: "tuples-intro",
                  type: "text",
                  content: "Tuples - Immutable Sequences\n\nTuples are like lists, but they cannot be changed after creation. They're created with parentheses () instead of square brackets []."
                },
                {
                  id: "code27",
                  type: "code",
                  language: "python",
                  content: '# Creating tuples\ncoordinates = (10, 20)\nrgb_color = (255, 128, 0)\nperson = ("Alex", 15, "student")\n\n# Accessing elements (same as lists)\nprint(coordinates[0])  # 10\nprint(person[-1])      # "student"\n\n# Unpacking tuples\nx, y = coordinates\nprint(f"x={x}, y={y}")  # x=10, y=20\n\nname, age, role = person\n\n# Tuples are immutable\n# coordinates[0] = 5  # This would cause an ERROR!'
                },
                {
                  id: "when-to-use",
                  type: "text",
                  content: "When to Use Each Data Structure\n\n• Lists: When you need a collection that can change (add, remove, modify)\n• Dictionaries: When you need to associate keys with values\n• Tuples: When you need a collection that should never change, or for returning multiple values from functions\n\nExample use cases:\n• List: Shopping cart items\n• Dictionary: Student records, configuration settings\n• Tuple: Coordinates, RGB colors, database records"
                },
                {
                  id: "quiz15",
                  type: "quiz",
                  question: "True or False: You can change the values inside a tuple after it's created",
                  quizType: "true-false",
                  correctAnswer: false,
                  explanation: "False! Tuples are immutable. Once created, you cannot change, add, or remove elements. This is the key difference between tuples and lists."
                }
              ]
            }
          ]
        },
        {
          id: "python-functions",
          title: "Python Functions",
          progress: 0,
          duration: "30 mins",
          xp: 300,
          status: "unlocked",
          lessons: [
            {
              id: "lesson1",
              title: "Creating and Using Functions",
              sections: [
                {
                  id: "functions-intro",
                  type: "text",
                  content: "Introduction to Functions\n\nFunctions are reusable blocks of code that perform specific tasks. They help you:\n• Avoid repeating code\n• Make your code more organized\n• Break down complex problems into smaller pieces\n• Make code easier to test and debug\n\nThink of functions as mini-programs within your program!"
                },
                {
                  id: "defining-functions",
                  type: "text",
                  content: "Defining Functions\n\nUse the 'def' keyword to create a function:"
                },
                {
                  id: "code28",
                  type: "code",
                  language: "python",
                  content: '# Simple function\ndef greet():\n    print("Hello, World!")\n\n# Call the function\ngreet()  # Output: Hello, World!\ngreet()  # You can call it multiple times\n\n# Function with parameter\ndef greet_person(name):\n    print(f"Hello, {name}!")\n\ngreet_person("Alex")   # Hello, Alex!\ngreet_person("Sarah")  # Hello, Sarah!'
                },
                {
                  id: "checkpoint10",
                  type: "checkpoint",
                  question: "Do you understand the difference between defining and calling a function?"
                },
                {
                  id: "return-values",
                  type: "text",
                  content: "Returning Values\n\nFunctions can send back a value using the 'return' statement:"
                },
                {
                  id: "code29",
                  type: "code",
                  language: "python",
                  content: '# Function that returns a value\ndef add(a, b):\n    result = a + b\n    return result\n\n# Use the returned value\nsum1 = add(5, 3)\nprint(sum1)  # 8\n\nsum2 = add(10, 20)\nprint(sum2)  # 30\n\n# You can return immediately\ndef multiply(a, b):\n    return a * b\n\nprint(multiply(4, 5))  # 20'
                },
                {
                  id: "multiple-parameters",
                  type: "text",
                  content: "Multiple Parameters and Default Values"
                },
                {
                  id: "code30",
                  type: "code",
                  language: "python",
                  content: '# Multiple parameters\ndef calculate_area(length, width):\n    return length * width\n\narea = calculate_area(5, 3)\nprint(f"Area: {area}")  # Area: 15\n\n# Default parameter values\ndef greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alex"))              # Hello, Alex!\nprint(greet("Alex", "Hi"))        # Hi, Alex!\nprint(greet("Alex", "Good morning"))  # Good morning, Alex!'
                },
                {
                  id: "quiz16",
                  type: "quiz",
                  question: "What does this function return?\n```python\ndef calculate(x, y):\n    return x * 2 + y\nresult = calculate(5, 3)\n```",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "13", correct: true },
                    { id: "b", text: "16", correct: false },
                    { id: "c", text: "8", correct: false },
                    { id: "d", text: "10", correct: false }
                  ],
                  explanation: "calculate(5, 3) computes: 5 * 2 + 3 = 10 + 3 = 13"
                },
                {
                  id: "scope",
                  type: "text",
                  content: "Variable Scope\n\nVariables created inside a function are local - they only exist within that function:"
                },
                {
                  id: "code31",
                  type: "code",
                  language: "python",
                  content: '# Global variable\nglobal_var = "I\'m global"\n\ndef my_function():\n    # Local variable\n    local_var = "I\'m local"\n    print(global_var)  # Can access global\n    print(local_var)   # Can access local\n\nmy_function()\n# print(local_var)  # ERROR! local_var doesn\'t exist here\n\n# Modifying global variables (not recommended)\ncounter = 0\n\ndef increment():\n    global counter\n    counter += 1\n\nincrement()\nprint(counter)  # 1'
                },
                {
                  id: "docstrings",
                  type: "text",
                  content: "Documenting Functions with Docstrings"
                },
                {
                  id: "code32",
                  type: "code",
                  language: "python",
                  content: 'def calculate_bmi(weight, height):\n    """\n    Calculate Body Mass Index.\n    \n    Parameters:\n        weight (float): Weight in kilograms\n        height (float): Height in meters\n    \n    Returns:\n        float: BMI value\n    """\n    return weight / (height ** 2)\n\nbmi = calculate_bmi(70, 1.75)\nprint(f"BMI: {bmi:.2f}")  # BMI: 22.86\n\n# Access docstring\nprint(calculate_bmi.__doc__)'
                },
                {
                  id: "quiz17",
                  type: "quiz",
                  question: "True or False: A function must always return a value",
                  quizType: "true-false",
                  correctAnswer: false,
                  explanation: "False! Functions without a return statement return None by default. Many functions perform actions without returning values."
                }
              ]
            },
            {
              id: "lesson2",
              title: "Advanced Function Concepts",
              sections: [
                {
                  id: "args-kwargs",
                  type: "text",
                  content: "Variable Number of Arguments\n\nSometimes you don't know how many arguments a function will receive. Python has special syntax for this:"
                },
                {
                  id: "code33",
                  type: "code",
                  language: "python",
                  content: '# *args - for variable positional arguments\ndef sum_all(*numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total\n\nprint(sum_all(1, 2, 3))         # 6\nprint(sum_all(10, 20, 30, 40))  # 100\n\n# **kwargs - for variable keyword arguments\ndef print_info(**info):\n    for key, value in info.items():\n        print(f"{key}: {value}")\n\nprint_info(name="Alex", age=15, grade="10th")\n# name: Alex\n# age: 15\n# grade: 10th'
                },
                {
                  id: "lambda-functions",
                  type: "text",
                  content: "Lambda Functions - Anonymous Functions\n\nLambda functions are small, one-line functions without a name:"
                },
                {
                  id: "code34",
                  type: "code",
                  language: "python",
                  content: '# Regular function\ndef square(x):\n    return x ** 2\n\n# Lambda equivalent\nsquare = lambda x: x ** 2\n\nprint(square(5))  # 25\n\n# Lambdas are useful with map, filter, sorted\nnumbers = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x ** 2, numbers))\nprint(squared)  # [1, 4, 9, 16, 25]\n\n# Filter even numbers\nevens = list(filter(lambda x: x % 2 == 0, numbers))\nprint(evens)  # [2, 4]\n\n# Sort by custom key\nstudents = [(\"Alex\", 85), (\"Bob\", 92), (\"Charlie\", 78)]\nsorted_students = sorted(students, key=lambda x: x[1], reverse=True)\nprint(sorted_students)  # Sorted by score'
                },
                {
                  id: "checkpoint11",
                  type: "checkpoint",
                  question: "Can you see when lambda functions are useful?"
                },
                {
                  id: "recursion",
                  type: "text",
                  content: "Recursion - Functions Calling Themselves\n\nA recursive function calls itself to solve a problem by breaking it into smaller pieces:"
                },
                {
                  id: "code35",
                  type: "code",
                  language: "python",
                  content: '# Calculate factorial recursively\ndef factorial(n):\n    # Base case\n    if n == 0 or n == 1:\n        return 1\n    # Recursive case\n    else:\n        return n * factorial(n - 1)\n\nprint(factorial(5))  # 120 (5 * 4 * 3 * 2 * 1)\n\n# Fibonacci sequence\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint([fibonacci(i) for i in range(10)])\n# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]'
                },
                {
                  id: "quiz18",
                  type: "quiz",
                  question: "What is a lambda function?\n",
                  quizType: "multiple-choice",
                  options: [
                    { id: "a", text: "A small anonymous function defined with lambda keyword", correct: true },
                    { id: "b", text: "A function that calls itself", correct: false },
                    { id: "c", text: "A function with variable arguments", correct: false },
                    { id: "d", text: "A built-in Python function", correct: false }
                  ],
                  explanation: "Lambda functions are small, anonymous functions defined inline using the lambda keyword. They're useful for short, simple operations."
                },
                {
                  id: "function-best-practices",
                  type: "text",
                  content: "Function Best Practices\n\n1. **Keep functions focused** - Each function should do one thing well\n2. **Use descriptive names** - calculate_total() is better than calc()\n3. **Add docstrings** - Explain what the function does\n4. **Limit parameters** - Too many parameters make functions hard to use\n5. **Return early** - Check error conditions first\n6. **Avoid global variables** - Pass data through parameters\n7. **Test your functions** - Make sure they work with different inputs"
                },
                {
                  id: "code36",
                  type: "code",
                  language: "python",
                  content: '# Good function example\ndef calculate_grade(score):\n    """\n    Convert a numerical score to a letter grade.\n    \n    Args:\n        score (int): Score between 0-100\n    \n    Returns:\n        str: Letter grade (A-F)\n    """\n    # Input validation\n    if score < 0 or score > 100:\n        return "Invalid score"\n    \n    # Clear logic\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    elif score >= 70:\n        return "C"\n    elif score >= 60:\n        return "D"\n    else:\n        return "F"\n\nprint(calculate_grade(85))  # B'
                },
                {
                  id: "conclusion-functions",
                  type: "text",
                  content: "Excellent work! You now understand:\n• How to create and use functions\n• Parameters and return values\n• Variable scope\n• Advanced concepts like *args, **kwargs, and lambdas\n• Recursion and when to use it\n• Best practices for writing clean functions\n\nFunctions are the building blocks of well-organized Python programs!"
                }
              ]
            }
          ]
        },
        {
          id: "python-file-handling",
          title: "Python File Handling & Modules",
          progress: 0,
          duration: "28 mins",
          xp: 280,
          status: "locked",
          lessons: []
        },
        {
          id: "python-oop",
          title: "Object-Oriented Programming in Python",
          progress: 0,
          duration: "40 mins",
          xp: 400,
          status: "locked",
          lessons: []
        },
        {
          id: "python-advanced",
          title: "Advanced Python Concepts",
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