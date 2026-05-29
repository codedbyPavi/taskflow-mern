const mappings = [
  {
    keywords: ["auth", "login", "authentication", "register"],
    subtasks: [
      "Create login form UI",
      "Build register endpoint",
      "Implement JWT token generation",
      "Add bcrypt password hashing",
      "Create auth middleware",
      "Add protected route wrapper"
    ]
  },
  {
    keywords: ["api", "endpoint", "backend", "route", "server"],
    subtasks: [
      "Define route structure",
      "Create controller logic",
      "Add input validation",
      "Write error handling",
      "Test with Postman or Thunder Client"
    ]
  },
  {
    keywords: ["database", "schema", "model", "mongodb", "db"],
    subtasks: [
      "Design data schema",
      "Create Mongoose model",
      "Add indexes for performance",
      "Seed test data",
      "Write database connection config"
    ]
  },
  {
    keywords: ["ui", "frontend", "component", "design", "page"],
    subtasks: [
      "Create component skeleton",
      "Add responsive layout",
      "Implement loading state",
      "Add error boundary",
      "Write hover and focus styles",
      "Test on mobile viewport"
    ]
  },
  {
    keywords: ["test", "testing", "unit test", "e2e"],
    subtasks: [
      "Write unit tests for utilities",
      "Add integration tests",
      "Mock API calls in tests",
      "Set up test environment",
      "Write edge case tests"
    ]
  },
  {
    keywords: ["deploy", "deployment", "hosting", "vercel", "render"],
    subtasks: [
      "Set environment variables",
      "Build production bundle",
      "Configure CORS for production URL",
      "Test deployed endpoints",
      "Set up custom domain (optional)"
    ]
  }
];

const fallback = [
  "Break down into smaller tasks",
  "Research and plan approach",
  "Write initial implementation",
  "Review and refactor",
  "Write documentation"
];

export const generateSubtasks = (title = "") => {
  const value = title.toLowerCase();
  const match = mappings.find((item) => item.keywords.some((keyword) => value.includes(keyword)));
  return (match?.subtasks || fallback).slice(0, 5);
};
