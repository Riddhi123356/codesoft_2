const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizmaker';

// ─── Schemas (inline so we can run this standalone) ───────────────────────────

const userSchema = new mongoose.Schema({ name: String, email: String, password: String }, { timestamps: true });
const User = mongoose.model('User', userSchema);

const optionSchema = new mongoose.Schema({ text: String, isCorrect: Boolean });
const questionSchema = new mongoose.Schema({ text: String, options: [optionSchema], explanation: String });
const quizSchema = new mongoose.Schema({
  title: String, description: String, category: String,
  difficulty: String, timeLimit: Number, questions: [questionSchema],
  creator: mongoose.Schema.Types.ObjectId, isPublished: Boolean,
  attempts: Number, tags: [String],
}, { timestamps: true });
const Quiz = mongoose.model('Quiz', quizSchema);

// ─── Sample Data ──────────────────────────────────────────────────────────────

const users = [
  { name: 'Admin QuizForge', email: 'admin@quizforge.com', password: 'admin123' },
  { name: 'Science Guru',    email: 'science@quizforge.com', password: 'science123' },
  { name: 'Tech Wizard',     email: 'tech@quizforge.com',    password: 'tech123' },
];

const quizzes = [
  // ── SCIENCE ────────────────────────────────────────────────────────────────
  {
    title: '🔬 General Science Basics',
    description: 'Test your knowledge of fundamental science concepts covering physics, chemistry, and biology.',
    category: 'Science',
    difficulty: 'Easy',
    timeLimit: 120,
    tags: ['science', 'basics', 'physics', 'chemistry'],
    questions: [
      {
        text: 'What is the chemical formula for water?',
        explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, giving it the formula H₂O.',
        options: [
          { text: 'H₂O',  isCorrect: true  },
          { text: 'CO₂',  isCorrect: false },
          { text: 'NaCl', isCorrect: false },
          { text: 'O₂',   isCorrect: false },
        ],
      },
      {
        text: 'Which planet is known as the Red Planet?',
        explanation: 'Mars appears red due to iron oxide (rust) on its surface.',
        options: [
          { text: 'Venus',   isCorrect: false },
          { text: 'Jupiter', isCorrect: false },
          { text: 'Mars',    isCorrect: true  },
          { text: 'Saturn',  isCorrect: false },
        ],
      },
      {
        text: 'What is the speed of light in a vacuum?',
        explanation: 'The speed of light in a vacuum is approximately 299,792,458 meters per second.',
        options: [
          { text: '150,000 km/s', isCorrect: false },
          { text: '300,000 km/s', isCorrect: true  },
          { text: '450,000 km/s', isCorrect: false },
          { text: '100,000 km/s', isCorrect: false },
        ],
      },
      {
        text: 'What gas do plants absorb during photosynthesis?',
        explanation: 'Plants absorb carbon dioxide (CO₂) and release oxygen (O₂) during photosynthesis.',
        options: [
          { text: 'Oxygen',         isCorrect: false },
          { text: 'Nitrogen',       isCorrect: false },
          { text: 'Carbon Dioxide', isCorrect: true  },
          { text: 'Hydrogen',       isCorrect: false },
        ],
      },
      {
        text: 'What is the powerhouse of the cell?',
        explanation: 'The mitochondria generates most of the cell\'s supply of ATP, used as a source of energy.',
        options: [
          { text: 'Nucleus',      isCorrect: false },
          { text: 'Mitochondria', isCorrect: true  },
          { text: 'Ribosome',     isCorrect: false },
          { text: 'Golgi body',   isCorrect: false },
        ],
      },
      {
        text: 'How many bones are in the adult human body?',
        explanation: 'The adult human body has 206 bones. Babies are born with around 270-300 bones.',
        options: [
          { text: '186', isCorrect: false },
          { text: '206', isCorrect: true  },
          { text: '226', isCorrect: false },
          { text: '246', isCorrect: false },
        ],
      },
    ],
  },

  // ── TECHNOLOGY ─────────────────────────────────────────────────────────────
  {
    title: '💻 Web Development Essentials',
    description: 'How well do you know HTML, CSS, JavaScript and modern web development concepts?',
    category: 'Technology',
    difficulty: 'Medium',
    timeLimit: 180,
    tags: ['web', 'html', 'css', 'javascript', 'coding'],
    questions: [
      {
        text: 'What does HTML stand for?',
        explanation: 'HTML stands for HyperText Markup Language, the standard language for creating web pages.',
        options: [
          { text: 'HyperText Markup Language',    isCorrect: true  },
          { text: 'HighText Machine Language',     isCorrect: false },
          { text: 'HyperText and Links Markup',    isCorrect: false },
          { text: 'Hyper Transfer Markup Language',isCorrect: false },
        ],
      },
      {
        text: 'Which CSS property controls text size?',
        explanation: 'The font-size property sets the size of the text.',
        options: [
          { text: 'text-size',  isCorrect: false },
          { text: 'font-style', isCorrect: false },
          { text: 'font-size',  isCorrect: true  },
          { text: 'text-style', isCorrect: false },
        ],
      },
      {
        text: 'Which company developed JavaScript?',
        explanation: 'JavaScript was created by Brendan Eich while working at Netscape Communications.',
        options: [
          { text: 'Microsoft', isCorrect: false },
          { text: 'Google',    isCorrect: false },
          { text: 'Apple',     isCorrect: false },
          { text: 'Netscape',  isCorrect: true  },
        ],
      },
      {
        text: 'What does API stand for?',
        explanation: 'API stands for Application Programming Interface — a way for two applications to communicate.',
        options: [
          { text: 'Application Programming Interface', isCorrect: true  },
          { text: 'Automated Process Integration',     isCorrect: false },
          { text: 'Application Protocol Interface',    isCorrect: false },
          { text: 'Advanced Programming Interface',    isCorrect: false },
        ],
      },
      {
        text: 'What is the correct way to declare a variable in modern JavaScript?',
        explanation: 'In modern JavaScript (ES6+), "let" and "const" are preferred over "var".',
        options: [
          { text: 'var x = 5',   isCorrect: false },
          { text: 'let x = 5',   isCorrect: true  },
          { text: 'dim x = 5',   isCorrect: false },
          { text: 'int x = 5',   isCorrect: false },
        ],
      },
      {
        text: 'Which HTTP method is used to send data to a server?',
        explanation: 'POST is used to send data to a server to create/update a resource.',
        options: [
          { text: 'GET',    isCorrect: false },
          { text: 'PUT',    isCorrect: false },
          { text: 'POST',   isCorrect: true  },
          { text: 'FETCH',  isCorrect: false },
        ],
      },
      {
        text: 'What does CSS stand for?',
        explanation: 'CSS stands for Cascading Style Sheets, used for styling HTML documents.',
        options: [
          { text: 'Creative Style Sheets',   isCorrect: false },
          { text: 'Cascading Style Sheets',  isCorrect: true  },
          { text: 'Computer Style Sheets',   isCorrect: false },
          { text: 'Colorful Style Sheets',   isCorrect: false },
        ],
      },
    ],
  },

  // ── MATH ───────────────────────────────────────────────────────────────────
  {
    title: '➗ Math Brain Teasers',
    description: 'Challenge your mathematical skills with arithmetic, algebra, and logical puzzles.',
    category: 'Math',
    difficulty: 'Medium',
    timeLimit: 150,
    tags: ['math', 'algebra', 'arithmetic', 'puzzles'],
    questions: [
      {
        text: 'What is the value of π (Pi) to two decimal places?',
        explanation: 'Pi (π) is approximately 3.14159..., commonly rounded to 3.14.',
        options: [
          { text: '3.12', isCorrect: false },
          { text: '3.14', isCorrect: true  },
          { text: '3.16', isCorrect: false },
          { text: '3.18', isCorrect: false },
        ],
      },
      {
        text: 'What is the square root of 144?',
        explanation: '12 × 12 = 144, so the square root of 144 is 12.',
        options: [
          { text: '11', isCorrect: false },
          { text: '13', isCorrect: false },
          { text: '12', isCorrect: true  },
          { text: '14', isCorrect: false },
        ],
      },
      {
        text: 'If x + 5 = 12, what is x?',
        explanation: 'Subtracting 5 from both sides: x = 12 - 5 = 7.',
        options: [
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '8', isCorrect: false },
          { text: '7', isCorrect: true  },
        ],
      },
      {
        text: 'What is 15% of 200?',
        explanation: '15% of 200 = (15/100) × 200 = 30.',
        options: [
          { text: '25', isCorrect: false },
          { text: '30', isCorrect: true  },
          { text: '35', isCorrect: false },
          { text: '20', isCorrect: false },
        ],
      },
      {
        text: 'What is the next prime number after 7?',
        explanation: 'After 7, the next number is 8 (not prime), then 9 (not prime), then 11 (prime).',
        options: [
          { text: '9',  isCorrect: false },
          { text: '10', isCorrect: false },
          { text: '11', isCorrect: true  },
          { text: '13', isCorrect: false },
        ],
      },
      {
        text: 'How many sides does a hexagon have?',
        explanation: 'A hexagon is a polygon with 6 sides. "Hex" means six in Greek.',
        options: [
          { text: '5', isCorrect: false },
          { text: '7', isCorrect: false },
          { text: '8', isCorrect: false },
          { text: '6', isCorrect: true  },
        ],
      },
    ],
  },

  // ── HISTORY ────────────────────────────────────────────────────────────────
  {
    title: '📜 World History Challenge',
    description: 'How much do you know about major world events, leaders, and civilizations throughout history?',
    category: 'History',
    difficulty: 'Hard',
    timeLimit: 200,
    tags: ['history', 'world', 'civilizations', 'events'],
    questions: [
      {
        text: 'In which year did World War II end?',
        explanation: 'World War II ended in 1945 — in Europe on May 8 (V-E Day) and in the Pacific on September 2 (V-J Day).',
        options: [
          { text: '1943', isCorrect: false },
          { text: '1944', isCorrect: false },
          { text: '1945', isCorrect: true  },
          { text: '1946', isCorrect: false },
        ],
      },
      {
        text: 'Who was the first President of the United States?',
        explanation: 'George Washington served as the first President from 1789 to 1797.',
        options: [
          { text: 'Abraham Lincoln',  isCorrect: false },
          { text: 'Thomas Jefferson', isCorrect: false },
          { text: 'John Adams',       isCorrect: false },
          { text: 'George Washington',isCorrect: true  },
        ],
      },
      {
        text: 'Which ancient wonder was located in Alexandria, Egypt?',
        explanation: 'The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World.',
        options: [
          { text: 'The Colossus of Rhodes',    isCorrect: false },
          { text: 'The Lighthouse of Alexandria', isCorrect: true },
          { text: 'The Hanging Gardens',       isCorrect: false },
          { text: 'The Statue of Zeus',        isCorrect: false },
        ],
      },
      {
        text: 'The French Revolution began in which year?',
        explanation: 'The French Revolution began in 1789 with the storming of the Bastille on July 14.',
        options: [
          { text: '1776', isCorrect: false },
          { text: '1789', isCorrect: true  },
          { text: '1799', isCorrect: false },
          { text: '1804', isCorrect: false },
        ],
      },
      {
        text: 'Who wrote "The Art of War"?',
        explanation: '"The Art of War" is an ancient Chinese military treatise attributed to Sun Tzu.',
        options: [
          { text: 'Confucius',   isCorrect: false },
          { text: 'Genghis Khan',isCorrect: false },
          { text: 'Sun Tzu',     isCorrect: true  },
          { text: 'Lao Tzu',     isCorrect: false },
        ],
      },
      {
        text: 'Which empire was ruled by Julius Caesar?',
        explanation: 'Julius Caesar was a Roman general and statesman who played a critical role in the Roman Empire.',
        options: [
          { text: 'Greek Empire',    isCorrect: false },
          { text: 'Ottoman Empire',  isCorrect: false },
          { text: 'Roman Empire',    isCorrect: true  },
          { text: 'Persian Empire',  isCorrect: false },
        ],
      },
      {
        text: 'When did the Berlin Wall fall?',
        explanation: 'The Berlin Wall fell on November 9, 1989, marking the end of the Cold War era in Europe.',
        options: [
          { text: '1987', isCorrect: false },
          { text: '1988', isCorrect: false },
          { text: '1989', isCorrect: true  },
          { text: '1991', isCorrect: false },
        ],
      },
    ],
  },

  // ── GENERAL ────────────────────────────────────────────────────────────────
  {
    title: '🌐 Ultimate General Knowledge',
    description: 'A fun mix of trivia spanning geography, sports, pop culture, and everyday knowledge.',
    category: 'General',
    difficulty: 'Easy',
    timeLimit: 0,
    tags: ['trivia', 'general', 'fun', 'mixed'],
    questions: [
      {
        text: 'What is the capital city of Japan?',
        explanation: 'Tokyo is the capital and most populous city of Japan.',
        options: [
          { text: 'Osaka',  isCorrect: false },
          { text: 'Kyoto',  isCorrect: false },
          { text: 'Tokyo',  isCorrect: true  },
          { text: 'Hiroshima', isCorrect: false },
        ],
      },
      {
        text: 'How many colors are in a rainbow?',
        explanation: 'A rainbow has 7 colors: Red, Orange, Yellow, Green, Blue, Indigo, Violet (ROYGBIV).',
        options: [
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: true  },
          { text: '8', isCorrect: false },
        ],
      },
      {
        text: 'Which ocean is the largest in the world?',
        explanation: 'The Pacific Ocean is the largest and deepest ocean, covering more than 30% of Earth\'s surface.',
        options: [
          { text: 'Atlantic Ocean', isCorrect: false },
          { text: 'Indian Ocean',   isCorrect: false },
          { text: 'Arctic Ocean',   isCorrect: false },
          { text: 'Pacific Ocean',  isCorrect: true  },
        ],
      },
      {
        text: 'How many players are on a standard football (soccer) team?',
        explanation: 'A standard football team has 11 players on the field at a time.',
        options: [
          { text: '9',  isCorrect: false },
          { text: '10', isCorrect: false },
          { text: '11', isCorrect: true  },
          { text: '12', isCorrect: false },
        ],
      },
      {
        text: 'What is the largest continent by area?',
        explanation: 'Asia is the largest continent, covering about 44.6 million km² (30% of Earth\'s land area).',
        options: [
          { text: 'Africa',        isCorrect: false },
          { text: 'Asia',          isCorrect: true  },
          { text: 'North America', isCorrect: false },
          { text: 'Europe',        isCorrect: false },
        ],
      },
      {
        text: 'Which language has the most native speakers worldwide?',
        explanation: 'Mandarin Chinese has approximately 920 million native speakers, making it the most spoken native language.',
        options: [
          { text: 'English',  isCorrect: false },
          { text: 'Spanish',  isCorrect: false },
          { text: 'Hindi',    isCorrect: false },
          { text: 'Mandarin', isCorrect: true  },
        ],
      },
    ],
  },

  // ── ENTERTAINMENT ──────────────────────────────────────────────────────────
  {
    title: '🎬 Movies & Pop Culture',
    description: 'Think you know your movies, music, and pop culture? Prove it with this fun entertainment quiz!',
    category: 'Entertainment',
    difficulty: 'Easy',
    timeLimit: 120,
    tags: ['movies', 'music', 'pop culture', 'entertainment'],
    questions: [
      {
        text: 'Which movie features the quote "May the Force be with you"?',
        explanation: 'This iconic quote comes from the Star Wars franchise, first spoken in Episode IV: A New Hope (1977).',
        options: [
          { text: 'Star Trek',  isCorrect: false },
          { text: 'Star Wars',  isCorrect: true  },
          { text: 'Interstellar', isCorrect: false },
          { text: 'Avatar',     isCorrect: false },
        ],
      },
      {
        text: 'Which band released the album "Abbey Road"?',
        explanation: 'Abbey Road was released by The Beatles in 1969 and is one of the best-selling albums of all time.',
        options: [
          { text: 'The Rolling Stones', isCorrect: false },
          { text: 'Led Zeppelin',       isCorrect: false },
          { text: 'The Beatles',        isCorrect: true  },
          { text: 'Pink Floyd',         isCorrect: false },
        ],
      },
      {
        text: 'In which fictional city does Batman live?',
        explanation: 'Batman is the protector of Gotham City, a fictional city inspired by New York City.',
        options: [
          { text: 'Metropolis',  isCorrect: false },
          { text: 'Star City',   isCorrect: false },
          { text: 'Central City',isCorrect: false },
          { text: 'Gotham City', isCorrect: true  },
        ],
      },
      {
        text: 'Who painted the Mona Lisa?',
        explanation: 'The Mona Lisa was painted by Leonardo da Vinci between 1503 and 1519.',
        options: [
          { text: 'Michelangelo',     isCorrect: false },
          { text: 'Vincent van Gogh', isCorrect: false },
          { text: 'Leonardo da Vinci',isCorrect: true  },
          { text: 'Pablo Picasso',    isCorrect: false },
        ],
      },
      {
        text: 'How many Harry Potter books are in the main series?',
        explanation: 'J.K. Rowling wrote 7 books in the main Harry Potter series, from The Philosopher\'s Stone to The Deathly Hallows.',
        options: [
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: true  },
          { text: '8', isCorrect: false },
        ],
      },
      {
        text: 'Which streaming platform produced "Stranger Things"?',
        explanation: 'Stranger Things is an original series produced and distributed by Netflix.',
        options: [
          { text: 'HBO',      isCorrect: false },
          { text: 'Netflix',  isCorrect: true  },
          { text: 'Disney+',  isCorrect: false },
          { text: 'Amazon Prime', isCorrect: false },
        ],
      },
    ],
  },

  // ── SPORTS ─────────────────────────────────────────────────────────────────
  {
    title: '⚽ Sports Trivia Showdown',
    description: 'From football to cricket to Olympics — test your sports knowledge across different disciplines!',
    category: 'Sports',
    difficulty: 'Medium',
    timeLimit: 150,
    tags: ['sports', 'football', 'cricket', 'olympics'],
    questions: [
      {
        text: 'Which country has won the most FIFA World Cup titles?',
        explanation: 'Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).',
        options: [
          { text: 'Germany',   isCorrect: false },
          { text: 'Argentina', isCorrect: false },
          { text: 'Brazil',    isCorrect: true  },
          { text: 'Italy',     isCorrect: false },
        ],
      },
      {
        text: 'How many players are on a basketball team on the court?',
        explanation: 'Each basketball team has 5 players on the court at a time.',
        options: [
          { text: '4', isCorrect: false },
          { text: '5', isCorrect: true  },
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: false },
        ],
      },
      {
        text: 'In which city were the 2020 Summer Olympics held?',
        explanation: 'The 2020 Summer Olympics were held in Tokyo, Japan in 2021 (delayed due to COVID-19).',
        options: [
          { text: 'Paris',  isCorrect: false },
          { text: 'Seoul',  isCorrect: false },
          { text: 'Tokyo',  isCorrect: true  },
          { text: 'Beijing',isCorrect: false },
        ],
      },
      {
        text: 'What sport is played at Wimbledon?',
        explanation: 'Wimbledon is the oldest and most prestigious tennis tournament in the world.',
        options: [
          { text: 'Cricket', isCorrect: false },
          { text: 'Tennis',  isCorrect: true  },
          { text: 'Squash',  isCorrect: false },
          { text: 'Badminton', isCorrect: false },
        ],
      },
      {
        text: 'Which athlete has won the most Olympic gold medals?',
        explanation: 'Michael Phelps holds the record with 23 Olympic gold medals in swimming.',
        options: [
          { text: 'Usain Bolt',    isCorrect: false },
          { text: 'Michael Phelps', isCorrect: true },
          { text: 'Carl Lewis',    isCorrect: false },
          { text: 'Mark Spitz',    isCorrect: false },
        ],
      },
      {
        text: 'How many points is a touchdown worth in American football?',
        explanation: 'A touchdown is worth 6 points in American football, plus an opportunity for extra points.',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: false },
          { text: '6', isCorrect: true  },
          { text: '7', isCorrect: false },
        ],
      },
    ],
  },

  // ── TECHNOLOGY HARD ────────────────────────────────────────────────────────
  {
    title: '🤖 Advanced Technology Quiz',
    description: 'Deep dive into AI, databases, networking, and computer science fundamentals for tech enthusiasts.',
    category: 'Technology',
    difficulty: 'Hard',
    timeLimit: 240,
    tags: ['AI', 'databases', 'networking', 'computer science'],
    questions: [
      {
        text: 'What does SQL stand for?',
        explanation: 'SQL stands for Structured Query Language, used to manage and query relational databases.',
        options: [
          { text: 'Structured Query Language',  isCorrect: true  },
          { text: 'Simple Query Language',      isCorrect: false },
          { text: 'Sequential Query Language',  isCorrect: false },
          { text: 'Standard Query Language',    isCorrect: false },
        ],
      },
      {
        text: 'Which data structure uses LIFO (Last In, First Out) order?',
        explanation: 'A Stack uses LIFO — the last element added is the first one to be removed.',
        options: [
          { text: 'Queue',      isCorrect: false },
          { text: 'Stack',      isCorrect: true  },
          { text: 'LinkedList', isCorrect: false },
          { text: 'Tree',       isCorrect: false },
        ],
      },
      {
        text: 'What does "GPU" stand for?',
        explanation: 'GPU stands for Graphics Processing Unit, specialized for rendering graphics and parallel computing.',
        options: [
          { text: 'General Processing Unit',   isCorrect: false },
          { text: 'Graphics Processing Unit',  isCorrect: true  },
          { text: 'Global Processing Unit',    isCorrect: false },
          { text: 'Graphical Program Unit',    isCorrect: false },
        ],
      },
      {
        text: 'Which protocol is used to send emails?',
        explanation: 'SMTP (Simple Mail Transfer Protocol) is the standard protocol for sending emails.',
        options: [
          { text: 'FTP',   isCorrect: false },
          { text: 'HTTP',  isCorrect: false },
          { text: 'SMTP',  isCorrect: true  },
          { text: 'IMAP',  isCorrect: false },
        ],
      },
      {
        text: 'What is the time complexity of binary search?',
        explanation: 'Binary search has O(log n) time complexity — it halves the search space with each step.',
        options: [
          { text: 'O(n)',      isCorrect: false },
          { text: 'O(log n)', isCorrect: true  },
          { text: 'O(n²)',    isCorrect: false },
          { text: 'O(1)',     isCorrect: false },
        ],
      },
      {
        text: 'Which of these is a NoSQL database?',
        explanation: 'MongoDB is a NoSQL document database. MySQL, PostgreSQL, and SQLite are relational (SQL) databases.',
        options: [
          { text: 'MySQL',      isCorrect: false },
          { text: 'PostgreSQL', isCorrect: false },
          { text: 'MongoDB',    isCorrect: true  },
          { text: 'SQLite',     isCorrect: false },
        ],
      },
      {
        text: 'What does "REST" stand for in REST API?',
        explanation: 'REST stands for Representational State Transfer, an architectural style for distributed systems.',
        options: [
          { text: 'Remote Execution State Transfer',          isCorrect: false },
          { text: 'Representational State Transfer',          isCorrect: true  },
          { text: 'Relational State Transfer',                isCorrect: false },
          { text: 'Responsive State Transfer',                isCorrect: false },
        ],
      },
    ],
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    // Clear existing data
    await User.deleteMany({});
    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing users and quizzes');

    // Create users
    const createdUsers = [];
    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      const user = await User.create({ name: u.name, email: u.email, password: hashed });
      createdUsers.push(user);
      console.log(`👤 Created user: ${u.name} (${u.email})`);
    }

    // Create quizzes — distribute among users
    for (let i = 0; i < quizzes.length; i++) {
      const creator = createdUsers[i % createdUsers.length];
      await Quiz.create({
        ...quizzes[i],
        creator: creator._id,
        isPublished: true,
        attempts: Math.floor(Math.random() * 200) + 10,
      });
      console.log(`📝 Created quiz: ${quizzes[i].title}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Users created   : ${createdUsers.length}`);
    console.log(`📚 Quizzes created : ${quizzes.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔑 Test Login Credentials:');
    users.forEach(u => console.log(`   ${u.email}  /  ${u.password}`));
    console.log('');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();