// Technical interview data
export const technicalRoles = [
  {
    id: 'frontend-developer',
    label: 'Frontend Developer',
    description: 'Build user interfaces with React, Vue, or Angular'
  },
  {
    id: 'backend-developer',
    label: 'Backend Developer',
    description: 'Build server-side applications with Node, Python, Java'
  },
  {
    id: 'full-stack-developer',
    label: 'Full Stack Developer',
    description: 'Master both frontend and backend technologies'
  },
  {
    id: 'devops-engineer',
    label: 'DevOps Engineer',
    description: 'Deploy and manage cloud infrastructure'
  },
  {
    id: 'data-scientist',
    label: 'Data Scientist',
    description: 'Work with data analytics and machine learning'
  },
  {
    id: 'qa-engineer',
    label: 'QA Engineer',
    description: 'Test software quality and automation'
  }
];

export const interviewTypes = [
  { value: 'technical', label: 'Technical Interview' },
  { value: 'behavioral', label: 'Behavioral Interview' },
  { value: 'system-design', label: 'System Design' },
  { value: 'coding', label: 'Coding Interview' },
  { value: 'data-structures', label: 'Data Structures & Algorithms' }
];

export const technicalQuestions = {
  'frontend-developer': [
    {
      id: 1,
      question: 'Explain the difference between var, let, and const in JavaScript.',
      difficulty: 'beginner',
      category: 'Fundamentals'
    },
    {
      id: 2,
      question: 'What is the difference between state and props in React?',
      difficulty: 'intermediate',
      category: 'React'
    },
    {
      id: 3,
      question: 'How would you optimize a React component\'s performance?',
      difficulty: 'advanced',
      category: 'Performance'
    },
    {
      id: 4,
      question: 'Explain CSS specificity and how it works.',
      difficulty: 'intermediate',
      category: 'CSS'
    },
    {
      id: 5,
      question: 'What is event delegation in JavaScript?',
      difficulty: 'intermediate',
      category: 'JavaScript'
    },
    {
      id: 6,
      question: 'How does the virtual DOM work in React?',
      difficulty: 'advanced',
      category: 'React'
    },
    {
      id: 7,
      question: 'Describe the box model in CSS.',
      difficulty: 'beginner',
      category: 'CSS'
    },
    {
      id: 8,
      question: 'What are React hooks and why were they introduced?',
      difficulty: 'intermediate',
      category: 'React'
    }
  ],
  'backend-developer': [
    {
      id: 1,
      question: 'Explain RESTful API design principles.',
      difficulty: 'intermediate',
      category: 'API Design'
    },
    {
      id: 2,
      question: 'What is database normalization?',
      difficulty: 'intermediate',
      category: 'Databases'
    },
    {
      id: 3,
      question: 'Explain the difference between SQL and NoSQL databases.',
      difficulty: 'intermediate',
      category: 'Databases'
    },
    {
      id: 4,
      question: 'What is authentication vs authorization?',
      difficulty: 'beginner',
      category: 'Security'
    },
    {
      id: 5,
      question: 'Describe the MVC architectural pattern.',
      difficulty: 'intermediate',
      category: 'Architecture'
    },
    {
      id: 6,
      question: 'How would you handle concurrent requests in a backend application?',
      difficulty: 'advanced',
      category: 'Concurrency'
    },
    {
      id: 7,
      question: 'What is middleware in Node.js Express?',
      difficulty: 'beginner',
      category: 'Node.js'
    },
    {
      id: 8,
      question: 'Explain horizontal vs vertical scaling.',
      difficulty: 'advanced',
      category: 'Scalability'
    }
  ],
  'full-stack-developer': [
    {
      id: 1,
      question: 'Walk me through your approach to building a full-stack application.',
      difficulty: 'intermediate',
      category: 'Architecture'
    },
    {
      id: 2,
      question: 'How do you handle authentication in a full-stack application?',
      difficulty: 'intermediate',
      category: 'Security'
    },
    {
      id: 3,
      question: 'What is a monolithic vs microservices architecture?',
      difficulty: 'advanced',
      category: 'Architecture'
    },
    {
      id: 4,
      question: 'Explain how you would implement real-time notifications.',
      difficulty: 'advanced',
      category: 'Real-time'
    },
    {
      id: 5,
      question: 'How do you optimize database queries?',
      difficulty: 'advanced',
      category: 'Databases'
    },
    {
      id: 6,
      question: 'What is CORS and why is it important?',
      difficulty: 'intermediate',
      category: 'Web Security'
    },
    {
      id: 7,
      question: 'Describe your CI/CD pipeline setup.',
      difficulty: 'intermediate',
      category: 'DevOps'
    },
    {
      id: 8,
      question: 'How would you approach debugging a full-stack application?',
      difficulty: 'intermediate',
      category: 'Debugging'
    }
  ],
  'devops-engineer': [
    {
      id: 1,
      question: 'What is containerization and why use Docker?',
      difficulty: 'beginner',
      category: 'Containerization'
    },
    {
      id: 2,
      question: 'Explain Kubernetes and its key components.',
      difficulty: 'intermediate',
      category: 'Orchestration'
    },
    {
      id: 3,
      question: 'What is Infrastructure as Code (IaC)?',
      difficulty: 'intermediate',
      category: 'IaC'
    },
    {
      id: 4,
      question: 'Describe your monitoring and alerting strategy.',
      difficulty: 'advanced',
      category: 'Monitoring'
    },
    {
      id: 5,
      question: 'How do you implement a CI/CD pipeline?',
      difficulty: 'intermediate',
      category: 'CI/CD'
    },
    {
      id: 6,
      question: 'Explain the difference between blue-green and canary deployments.',
      difficulty: 'advanced',
      category: 'Deployments'
    },
    {
      id: 7,
      question: 'What is a load balancer and how does it work?',
      difficulty: 'intermediate',
      category: 'Infrastructure'
    },
    {
      id: 8,
      question: 'How do you handle secrets management in production?',
      difficulty: 'advanced',
      category: 'Security'
    }
  ],
  'data-scientist': [
    {
      id: 1,
      question: 'Explain the difference between supervised and unsupervised learning.',
      difficulty: 'beginner',
      category: 'ML Basics'
    },
    {
      id: 2,
      question: 'What is overfitting and how do you prevent it?',
      difficulty: 'intermediate',
      category: 'ML Concepts'
    },
    {
      id: 3,
      question: 'Walk me through your approach to a data science project.',
      difficulty: 'intermediate',
      category: 'Methodology'
    },
    {
      id: 4,
      question: 'How do you handle missing data in a dataset?',
      difficulty: 'beginner',
      category: 'Data Preprocessing'
    },
    {
      id: 5,
      question: 'Explain cross-validation and why it\'s important.',
      difficulty: 'intermediate',
      category: 'Validation'
    },
    {
      id: 6,
      question: 'What is feature engineering and how do you approach it?',
      difficulty: 'advanced',
      category: 'Feature Engineering'
    },
    {
      id: 7,
      question: 'Describe the bias-variance tradeoff.',
      difficulty: 'advanced',
      category: 'ML Theory'
    },
    {
      id: 8,
      question: 'How would you deploy a machine learning model in production?',
      difficulty: 'advanced',
      category: 'Production'
    }
  ],
  'qa-engineer': [
    {
      id: 1,
      question: 'Explain the difference between functional and non-functional testing.',
      difficulty: 'beginner',
      category: 'Testing Types'
    },
    {
      id: 2,
      question: 'What is the testing pyramid and why is it important?',
      difficulty: 'intermediate',
      category: 'Testing Strategy'
    },
    {
      id: 3,
      question: 'How do you approach writing automated tests?',
      difficulty: 'intermediate',
      category: 'Automation'
    },
    {
      id: 4,
      question: 'Explain the difference between smoke, sanity, and regression testing.',
      difficulty: 'intermediate',
      category: 'Testing Types'
    },
    {
      id: 5,
      question: 'What is boundary value analysis?',
      difficulty: 'intermediate',
      category: 'Test Techniques'
    },
    {
      id: 6,
      question: 'How do you identify and report bugs effectively?',
      difficulty: 'beginner',
      category: 'Bug Reporting'
    },
    {
      id: 7,
      question: 'Describe your approach to API testing.',
      difficulty: 'intermediate',
      category: 'API Testing'
    },
    {
      id: 8,
      question: 'How would you set up a continuous integration testing pipeline?',
      difficulty: 'advanced',
      category: 'CI/CD'
    }
  ]
};
