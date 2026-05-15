const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// ─── Inline schemas (avoids circular import issues when running seeder standalone) ───

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'employer', 'admin'], default: 'candidate' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  resume: { type: String, default: '' },
  skills: [{ type: String }],
  experience: [{ title: String, company: String, location: String, from: Date, to: Date, current: { type: Boolean, default: false }, description: String }],
  education: [{ school: String, degree: String, fieldOfStudy: String, from: Date, to: Date, current: { type: Boolean, default: false } }],
  company: {
    name: { type: String, default: '' },
    website: { type: String, default: '' },
    size: { type: String, default: '' },
    industry: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' }
  },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  companyLogo: { type: String, default: '' },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  location: { type: String, required: true },
  locationType: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'onsite' },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], default: 'full-time' },
  category: { type: String, required: true },
  experience: { type: String, enum: ['entry', 'mid', 'senior', 'lead', 'manager'], default: 'mid' },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
    isNegotiable: { type: Boolean, default: false }
  },
  skills: [{ type: String }],
  benefits: [{ type: String }],
  applicationDeadline: { type: Date },
  applicationCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });
jobSchema.index({ category: 1, location: 1, type: 1, status: 1 });

const User = mongoose.model('User', userSchema);
const Job  = mongoose.model('Job',  jobSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const usersData = [
  // Admin
  {
    name: 'Admin User',
    email: 'admin@jobboard.com',
    password: 'admin123',
    role: 'admin',
    location: 'New York, USA',
    bio: 'Platform administrator.',
    isVerified: true,
  },

  // Employers
  {
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    password: 'employer123',
    role: 'employer',
    location: 'San Francisco, USA',
    bio: 'HR Manager at TechCorp. Passionate about finding great talent.',
    isVerified: true,
    company: {
      name: 'TechCorp Inc.',
      website: 'https://techcorp.example.com',
      size: '500-1000',
      industry: 'Software',
      description: 'Leading software solutions company building products used by millions worldwide.',
      logo: '',
    },
  },
  {
    name: 'Raj Mehta',
    email: 'raj@designstudio.com',
    password: 'employer123',
    role: 'employer',
    location: 'Austin, USA',
    bio: 'Founder of DesignStudio. We build beautiful digital experiences.',
    isVerified: true,
    company: {
      name: 'DesignStudio',
      website: 'https://designstudio.example.com',
      size: '10-50',
      industry: 'Design',
      description: 'Boutique design agency specialising in UI/UX and brand identity.',
      logo: '',
    },
  },
  {
    name: 'Emily Chen',
    email: 'emily@cloudbase.io',
    password: 'employer123',
    role: 'employer',
    location: 'Seattle, USA',
    bio: 'CTO at CloudBase. Building the infrastructure of tomorrow.',
    isVerified: true,
    company: {
      name: 'CloudBase',
      website: 'https://cloudbase.example.io',
      size: '100-500',
      industry: 'Cloud Infrastructure',
      description: 'Cloud-native platform helping startups scale from zero to production.',
      logo: '',
    },
  },

  // Candidates
  {
    name: 'Alex Turner',
    email: 'alex@candidate.com',
    password: 'candidate123',
    role: 'candidate',
    location: 'Boston, USA',
    bio: 'Full-stack developer with 4 years of experience in React and Node.js.',
    isVerified: true,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
    experience: [
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        from: new Date('2021-06-01'),
        to: new Date('2023-12-01'),
        current: false,
        description: 'Built and maintained React-based dashboards for B2B clients.',
      },
    ],
    education: [
      {
        school: 'MIT',
        degree: 'B.Sc.',
        fieldOfStudy: 'Computer Science',
        from: new Date('2017-09-01'),
        to: new Date('2021-05-01'),
        current: false,
      },
    ],
  },
  {
    name: 'Priya Sharma',
    email: 'priya@candidate.com',
    password: 'candidate123',
    role: 'candidate',
    location: 'Chicago, USA',
    bio: 'UI/UX designer who loves turning complex problems into simple experiences.',
    isVerified: true,
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    experience: [
      {
        title: 'UX Designer',
        company: 'AgencyBlue',
        location: 'Chicago, USA',
        from: new Date('2020-03-01'),
        current: true,
        description: 'Led end-to-end design for mobile and web products across fintech clients.',
      },
    ],
    education: [
      {
        school: 'University of Illinois',
        degree: 'B.Des.',
        fieldOfStudy: 'Interaction Design',
        from: new Date('2016-09-01'),
        to: new Date('2020-05-01'),
        current: false,
      },
    ],
  },
];

// Jobs are built after users are inserted (we need employer ObjectIds)
const buildJobsData = (employers) => {
  const [sarah, raj, emily] = employers;
  const deadline = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  return [
    // ── TechCorp jobs ──────────────────────────────────────────────────────
    {
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      employer: sarah._id,
      description: 'We are looking for a Senior React Developer to join our growing product team. You will work closely with designers and backend engineers to ship high-quality features for our SaaS platform.',
      requirements: [
        '4+ years of experience with React',
        'Strong understanding of hooks, context, and state management',
        'Experience with TypeScript',
        'Familiarity with REST APIs and GraphQL',
      ],
      responsibilities: [
        'Build and maintain scalable React components',
        'Collaborate with the design team on UI/UX improvements',
        'Write unit and integration tests',
        'Mentor junior developers',
      ],
      location: 'San Francisco, USA',
      locationType: 'hybrid',
      type: 'full-time',
      category: 'Engineering',
      experience: 'senior',
      salary: { min: 130000, max: 170000, currency: 'USD', period: 'yearly', isNegotiable: false },
      skills: ['React', 'TypeScript', 'GraphQL', 'Jest', 'Tailwind CSS'],
      benefits: ['Health insurance', '401(k)', 'Remote Fridays', 'Annual learning budget'],
      applicationDeadline: deadline(30),
      featured: true,
      urgent: false,
      status: 'active',
    },
    {
      title: 'Backend Engineer (Node.js)',
      company: 'TechCorp Inc.',
      employer: sarah._id,
      description: 'Join our backend team to build and scale the APIs powering TechCorp\'s platform. You\'ll work on high-throughput microservices and contribute to our infrastructure roadmap.',
      requirements: [
        '3+ years of Node.js experience',
        'Experience with MongoDB or PostgreSQL',
        'Knowledge of REST API design and authentication patterns',
        'Familiarity with Docker and CI/CD pipelines',
      ],
      responsibilities: [
        'Design and implement RESTful APIs',
        'Optimise database queries for performance',
        'Participate in on-call rotation',
        'Write thorough documentation',
      ],
      location: 'San Francisco, USA',
      locationType: 'onsite',
      type: 'full-time',
      category: 'Engineering',
      experience: 'mid',
      salary: { min: 110000, max: 145000, currency: 'USD', period: 'yearly', isNegotiable: false },
      skills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
      benefits: ['Health insurance', '401(k)', 'Stock options', 'Catered lunches'],
      applicationDeadline: deadline(45),
      featured: false,
      urgent: true,
      status: 'active',
    },
    {
      title: 'Junior QA Engineer',
      company: 'TechCorp Inc.',
      employer: sarah._id,
      description: 'Great opportunity for a recent grad or career-switcher to break into quality assurance at a well-funded startup. You will learn automated testing alongside an experienced QA team.',
      requirements: [
        'Basic understanding of software development lifecycle',
        'Willingness to learn Cypress or Playwright',
        'Good communication skills',
      ],
      responsibilities: [
        'Write and execute manual test cases',
        'Assist in building automated test suites',
        'Log and track bugs in Jira',
      ],
      location: 'San Francisco, USA',
      locationType: 'onsite',
      type: 'full-time',
      category: 'Engineering',
      experience: 'entry',
      salary: { min: 60000, max: 80000, currency: 'USD', period: 'yearly', isNegotiable: true },
      skills: ['Manual Testing', 'Cypress', 'Jira', 'Agile'],
      benefits: ['Health insurance', '401(k)', 'Mentorship programme'],
      applicationDeadline: deadline(20),
      featured: false,
      urgent: false,
      status: 'active',
    },

    // ── DesignStudio jobs ──────────────────────────────────────────────────
    {
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      employer: raj._id,
      description: 'DesignStudio is hiring a UI/UX Designer to lead design for our client projects. You will own the design process from discovery to handoff, working directly with our small, talented team.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma',
        'Strong portfolio showcasing web and mobile work',
        'Experience running user research sessions',
      ],
      responsibilities: [
        'Lead UX research and discovery workshops',
        'Create wireframes, prototypes, and high-fidelity mockups',
        'Collaborate with developers during implementation',
        'Maintain and evolve the design system',
      ],
      location: 'Austin, USA',
      locationType: 'hybrid',
      type: 'full-time',
      category: 'Design',
      experience: 'mid',
      salary: { min: 85000, max: 110000, currency: 'USD', period: 'yearly', isNegotiable: false },
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe XD'],
      benefits: ['Flexible hours', 'Home office stipend', 'Conference budget'],
      applicationDeadline: deadline(25),
      featured: true,
      urgent: false,
      status: 'active',
    },
    {
      title: 'Brand Designer (Freelance)',
      company: 'DesignStudio',
      employer: raj._id,
      description: 'We need a talented brand designer for a 3-month project creating a complete brand identity for a fintech startup client. Remote-friendly.',
      requirements: [
        'Strong portfolio in brand identity work',
        'Experience with logo, typography, and colour system design',
        'Ability to work independently and meet deadlines',
      ],
      responsibilities: [
        'Develop logo concepts and brand guidelines',
        'Produce brand asset packages for print and digital',
        'Present concepts and incorporate client feedback',
      ],
      location: 'Remote',
      locationType: 'remote',
      type: 'freelance',
      category: 'Design',
      experience: 'mid',
      salary: { min: 5000, max: 8000, currency: 'USD', period: 'monthly', isNegotiable: true },
      skills: ['Branding', 'Illustrator', 'Figma', 'Typography'],
      benefits: ['Fully remote', 'Flexible schedule'],
      applicationDeadline: deadline(10),
      featured: false,
      urgent: true,
      status: 'active',
    },

    // ── CloudBase jobs ─────────────────────────────────────────────────────
    {
      title: 'DevOps Engineer',
      company: 'CloudBase',
      employer: emily._id,
      description: 'CloudBase is scaling fast and we need a DevOps engineer to keep our infrastructure reliable, observable, and cost-efficient. You\'ll own our CI/CD pipelines and Kubernetes clusters.',
      requirements: [
        '3+ years of DevOps or SRE experience',
        'Hands-on with Kubernetes and Helm',
        'Experience with AWS or GCP',
        'Proficiency in Terraform or Pulumi',
      ],
      responsibilities: [
        'Manage and optimise Kubernetes clusters',
        'Build and improve CI/CD pipelines',
        'Implement monitoring with Prometheus and Grafana',
        'Lead incident response and post-mortems',
      ],
      location: 'Seattle, USA',
      locationType: 'hybrid',
      type: 'full-time',
      category: 'DevOps',
      experience: 'senior',
      salary: { min: 140000, max: 180000, currency: 'USD', period: 'yearly', isNegotiable: false },
      skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'Prometheus', 'CI/CD'],
      benefits: ['Health + dental + vision', 'Remote option', 'Stock options', '$500/mo wellness stipend'],
      applicationDeadline: deadline(35),
      featured: true,
      urgent: false,
      status: 'active',
    },
    {
      title: 'Data Engineer (Contract)',
      company: 'CloudBase',
      employer: emily._id,
      description: 'Six-month contract role to help build our internal data platform. You will design and implement ELT pipelines that power our analytics and product intelligence tools.',
      requirements: [
        'Experience with dbt, Airflow, or similar pipeline tools',
        'Strong SQL skills',
        'Familiarity with a cloud data warehouse (Snowflake, BigQuery, Redshift)',
      ],
      responsibilities: [
        'Design and build ELT pipelines',
        'Model data in dbt and maintain data quality checks',
        'Work with analysts to understand reporting needs',
        'Document data lineage and schemas',
      ],
      location: 'Remote',
      locationType: 'remote',
      type: 'contract',
      category: 'Data',
      experience: 'mid',
      salary: { min: 90, max: 120, currency: 'USD', period: 'hourly', isNegotiable: false },
      skills: ['dbt', 'Airflow', 'SQL', 'Snowflake', 'Python'],
      benefits: ['Fully remote', 'Flexible hours'],
      applicationDeadline: deadline(15),
      featured: false,
      urgent: false,
      status: 'active',
    },
    {
      title: 'Engineering Intern (Summer)',
      company: 'CloudBase',
      employer: emily._id,
      description: 'Join CloudBase for a 12-week paid summer internship on our platform team. You\'ll ship real features alongside senior engineers and leave with meaningful work in your portfolio.',
      requirements: [
        'Currently enrolled in a CS or related degree',
        'Familiarity with at least one programming language',
        'Eagerness to learn cloud technologies',
      ],
      responsibilities: [
        'Work on an assigned feature project with a mentor',
        'Attend daily standups and weekly team meetings',
        'Present your project at the end-of-summer demo day',
      ],
      location: 'Seattle, USA',
      locationType: 'onsite',
      type: 'internship',
      category: 'Engineering',
      experience: 'entry',
      salary: { min: 35, max: 45, currency: 'USD', period: 'hourly', isNegotiable: false },
      skills: ['Python', 'Go', 'Docker', 'Linux'],
      benefits: ['Paid internship', 'Housing stipend', 'Return offer consideration'],
      applicationDeadline: deadline(60),
      featured: false,
      urgent: false,
      status: 'active',
    },
  ];
};

// ─── Seeder ───────────────────────────────────────────────────────────────────

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobboard');
    console.log('MongoDB connected.');

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    console.log('Existing data cleared.');

    // Hash passwords manually (schema pre-save hook doesn't run on insertMany)
    const hashedUsers = await Promise.all(
      usersData.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        return { ...u, password: await bcrypt.hash(u.password, salt) };
      })
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`${insertedUsers.length} users inserted.`);

    // Employers are indices 1, 2, 3 (index 0 is admin)
    const employers = insertedUsers.slice(1, 4);
    const jobsData  = buildJobsData(employers);

    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`${insertedJobs.length} jobs inserted.`);

    console.log('\n✓ Database seeded successfully!\n');
    console.log('─── Login credentials ───────────────────────────');
    console.log('Admin     → admin@jobboard.com     / admin123');
    console.log('Employer1 → sarah@techcorp.com      / employer123');
    console.log('Employer2 → raj@designstudio.com    / employer123');
    console.log('Employer3 → emily@cloudbase.io      / employer123');
    console.log('Candidate → alex@candidate.com      / candidate123');
    console.log('Candidate → priya@candidate.com     / candidate123');
    console.log('─────────────────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobboard');
    console.log('MongoDB connected.');

    await User.deleteMany();
    await Job.deleteMany();

    console.log('✓ All data destroyed.');
    process.exit(0);
  } catch (err) {
    console.error('Destroy error:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}