export const lessons = {
  'html-fundamentals': {
    1: {
      id: 1,
      title: 'What is HTML?',
      content: [
        {
          type: 'text',
          text: 'Welcome to HTML! Let\'s start simple – what is HTML?\n\nHTML, or HyperText Markup Language, is the standard markup language for documents designed to be displayed in a web browser. It\'s the backbone of every website you visit.\n\nThink of HTML as the skeleton of a web page. Just like how your skeleton gives your body structure, HTML gives structure to web pages.'
        },
        {
          type: 'quiz',
          question: 'Quick check: What does HTML stand for?',
          options: [
            { id: 'a', text: 'HyperText Markup Language', correct: true },
            { id: 'b', text: 'High Tech Modern Language', correct: false },
            { id: 'c', text: 'Home Tool Markup Language', correct: false }
          ],
          explanation: 'HTML stands for HyperText Markup Language. "HyperText" refers to links that connect web pages, and "Markup" means you\'re marking up content with tags.'
        },
        {
          type: 'text',
          text: 'HTML uses tags to mark up content. Tags are like labels that tell the browser what kind of content it\'s dealing with. For example, a heading tag tells the browser "this is a heading," and a paragraph tag says "this is a paragraph."\n\nMost HTML tags come in pairs: an opening tag and a closing tag. The opening tag marks where something begins, and the closing tag marks where it ends.'
        },
        {
          type: 'checkpoint',
          question: 'Do you understand this part?',
          rewindTo: 1
        },
        {
          type: 'text',
          text: 'Here\'s a simple example:\n<h1>This is a heading</h1>\n<p>This is a paragraph.</p>\n\nThe <h1> tag creates a heading, and </h1> closes it. The <p> tag creates a paragraph, and </p> closes it.\n\nEvery HTML document starts with a DOCTYPE declaration and an <html> tag, contains a <head> section for metadata, and a <body> section for visible content.'
        },
        {
          type: 'quiz',
          question: 'What is the purpose of HTML tags?',
          options: [
            { id: 'a', text: 'To style the web page', correct: false },
            { id: 'b', text: 'To mark up and structure content', correct: true },
            { id: 'c', text: 'To add interactivity', correct: false }
          ],
          explanation: 'HTML tags mark up and structure content. Styling is done with CSS, and interactivity is added with JavaScript.'
        }
      ]
    },
    2: {
      id: 2,
      title: 'HTML Tags',
      content: [
        {
          type: 'text',
          text: 'Now that you understand what HTML is, let\'s dive into HTML tags!\n\nTags are the building blocks of HTML. They tell the browser how to display content. Every tag has a specific purpose and meaning.\n\nLet\'s explore the most common HTML tags you\'ll use.'
        },
        {
          type: 'text',
          text: 'Heading Tags: <h1> through <h6>\n\nHeadings create hierarchy in your content. <h1> is the most important (like a book title), and <h6> is the least important (like a small subheading).\n\nYou should only use one <h1> per page, typically for the main title.'
        },
        {
          type: 'quiz',
          question: 'Which heading tag is the most important?',
          options: [
            { id: 'a', text: '<h1>', correct: true },
            { id: 'b', text: '<h3>', correct: false },
            { id: 'c', text: '<h6>', correct: false }
          ],
          explanation: '<h1> is the most important heading tag. Think of it as the main title of your page.'
        },
        {
          type: 'checkpoint',
          question: 'Do you understand this part?',
          rewindTo: 1
        }
      ]
    }
  }
};