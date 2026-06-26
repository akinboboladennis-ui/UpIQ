import type { NormalizedSkillEntry, SkillCategory } from '../types/index.js'

/**
 * Canonical skill dictionary.
 * Each entry maps common aliases to a normalized name + category.
 * Keys are lower-case aliases; values are the canonical record.
 */
export const SKILL_DICTIONARY: NormalizedSkillEntry[] = [
  // ─── Frontend ────────────────────────────────────────────────────────────
  {
    original: 'React',
    normalized: 'React',
    aliases: ['reactjs', 'react.js', 'react js'],
    category: 'frontend',
  },
  {
    original: 'Next.js',
    normalized: 'Next.js',
    aliases: ['nextjs', 'next js', 'next.js'],
    category: 'frontend',
  },
  {
    original: 'Vue.js',
    normalized: 'Vue.js',
    aliases: ['vuejs', 'vue js', 'vue 3', 'vue2', 'vue3'],
    category: 'frontend',
  },
  {
    original: 'Angular',
    normalized: 'Angular',
    aliases: ['angularjs', 'angular js', 'angular 2', 'angular2'],
    category: 'frontend',
  },
  {
    original: 'TypeScript',
    normalized: 'TypeScript',
    aliases: ['typescript', 'ts'],
    category: 'frontend',
  },
  {
    original: 'JavaScript',
    normalized: 'JavaScript',
    aliases: ['javascript', 'js', 'ecmascript', 'es6', 'es2015'],
    category: 'frontend',
  },
  {
    original: 'HTML',
    normalized: 'HTML',
    aliases: ['html5', 'html 5', 'hypertext markup language'],
    category: 'frontend',
  },
  {
    original: 'CSS',
    normalized: 'CSS',
    aliases: ['css3', 'css 3', 'cascading style sheets'],
    category: 'frontend',
  },
  {
    original: 'Tailwind CSS',
    normalized: 'Tailwind CSS',
    aliases: ['tailwind', 'tailwindcss', 'tailwind css'],
    category: 'frontend',
  },
  {
    original: 'Sass/SCSS',
    normalized: 'Sass/SCSS',
    aliases: ['sass', 'scss', 'less'],
    category: 'frontend',
  },
  {
    original: 'Redux',
    normalized: 'Redux',
    aliases: ['redux', 'redux toolkit', 'rtk', 'zustand'],
    category: 'frontend',
  },
  {
    original: 'Svelte',
    normalized: 'Svelte',
    aliases: ['svelte', 'sveltekit'],
    category: 'frontend',
  },
  { original: 'Remix', normalized: 'Remix', aliases: ['remix', 'remix.run'], category: 'frontend' },
  {
    original: 'Gatsby',
    normalized: 'Gatsby',
    aliases: ['gatsby', 'gatsby.js'],
    category: 'frontend',
  },
  {
    original: 'Webpack',
    normalized: 'Webpack',
    aliases: ['webpack', 'vite', 'rollup', 'parcel'],
    category: 'frontend',
  },
  {
    original: 'Storybook',
    normalized: 'Storybook',
    aliases: ['storybook', 'chromatic'],
    category: 'frontend',
  },

  // ─── Backend ──────────────────────────────────────────────────────────────
  {
    original: 'Node.js',
    normalized: 'Node.js',
    aliases: ['nodejs', 'node js', 'node.js'],
    category: 'backend',
  },
  {
    original: 'Express.js',
    normalized: 'Express.js',
    aliases: ['express', 'expressjs', 'express.js'],
    category: 'backend',
  },
  {
    original: 'NestJS',
    normalized: 'NestJS',
    aliases: ['nestjs', 'nest.js', 'nest js'],
    category: 'backend',
  },
  {
    original: 'Python',
    normalized: 'Python',
    aliases: ['python', 'python3', 'python 3'],
    category: 'backend',
  },
  {
    original: 'Django',
    normalized: 'Django',
    aliases: ['django', 'django rest framework', 'drf'],
    category: 'backend',
  },
  {
    original: 'FastAPI',
    normalized: 'FastAPI',
    aliases: ['fastapi', 'fast api'],
    category: 'backend',
  },
  { original: 'Flask', normalized: 'Flask', aliases: ['flask', 'flask-api'], category: 'backend' },
  { original: 'PHP', normalized: 'PHP', aliases: ['php', 'php8', 'php 8'], category: 'backend' },
  {
    original: 'Laravel',
    normalized: 'Laravel',
    aliases: ['laravel', 'laravel php'],
    category: 'backend',
  },
  { original: 'Symfony', normalized: 'Symfony', aliases: ['symfony'], category: 'backend' },
  {
    original: 'Ruby on Rails',
    normalized: 'Ruby on Rails',
    aliases: ['rails', 'ruby on rails', 'ror', 'ruby'],
    category: 'backend',
  },
  {
    original: 'Go',
    normalized: 'Go',
    aliases: ['golang', 'go lang', 'go programming'],
    category: 'backend',
  },
  { original: 'Rust', normalized: 'Rust', aliases: ['rust', 'rust lang'], category: 'backend' },
  {
    original: 'Java',
    normalized: 'Java',
    aliases: ['java', 'java ee', 'jakarta ee'],
    category: 'backend',
  },
  {
    original: 'Spring Boot',
    normalized: 'Spring Boot',
    aliases: ['spring boot', 'spring', 'springboot'],
    category: 'backend',
  },
  {
    original: 'C#',
    normalized: 'C#',
    aliases: ['c#', 'csharp', 'c sharp', '.net', 'dotnet'],
    category: 'backend',
  },
  {
    original: 'ASP.NET',
    normalized: 'ASP.NET',
    aliases: ['asp.net', 'asp net', 'aspnet', '.net core'],
    category: 'backend',
  },
  {
    original: 'GraphQL',
    normalized: 'GraphQL',
    aliases: ['graphql', 'graph ql', 'gql'],
    category: 'backend',
  },
  {
    original: 'REST API',
    normalized: 'REST API',
    aliases: ['rest', 'rest api', 'restful', 'restful api', 'api development'],
    category: 'backend',
  },
  {
    original: 'WebSocket',
    normalized: 'WebSocket',
    aliases: ['websocket', 'websockets', 'socket.io', 'socketio'],
    category: 'backend',
  },
  {
    original: 'Microservices',
    normalized: 'Microservices',
    aliases: ['microservices', 'micro services', 'microservice architecture'],
    category: 'backend',
  },

  // ─── Mobile ───────────────────────────────────────────────────────────────
  {
    original: 'React Native',
    normalized: 'React Native',
    aliases: ['react native', 'reactnative'],
    category: 'mobile',
  },
  {
    original: 'Flutter',
    normalized: 'Flutter',
    aliases: ['flutter', 'dart', 'flutter/dart'],
    category: 'mobile',
  },
  {
    original: 'Swift',
    normalized: 'Swift',
    aliases: ['swift', 'swiftui', 'ios development', 'ios dev'],
    category: 'mobile',
  },
  {
    original: 'Kotlin',
    normalized: 'Kotlin',
    aliases: ['kotlin', 'android development', 'android dev'],
    category: 'mobile',
  },
  {
    original: 'Ionic',
    normalized: 'Ionic',
    aliases: ['ionic', 'ionic framework'],
    category: 'mobile',
  },
  { original: 'Expo', normalized: 'Expo', aliases: ['expo', 'expo go'], category: 'mobile' },

  // ─── Database ─────────────────────────────────────────────────────────────
  {
    original: 'PostgreSQL',
    normalized: 'PostgreSQL',
    aliases: ['postgresql', 'postgres', 'pg'],
    category: 'database',
  },
  {
    original: 'MySQL',
    normalized: 'MySQL',
    aliases: ['mysql', 'my sql', 'mariadb'],
    category: 'database',
  },
  {
    original: 'MongoDB',
    normalized: 'MongoDB',
    aliases: ['mongodb', 'mongo', 'mongoose'],
    category: 'database',
  },
  {
    original: 'Redis',
    normalized: 'Redis',
    aliases: ['redis', 'redis cache'],
    category: 'database',
  },
  {
    original: 'SQLite',
    normalized: 'SQLite',
    aliases: ['sqlite', 'sqlite3'],
    category: 'database',
  },
  { original: 'Supabase', normalized: 'Supabase', aliases: ['supabase'], category: 'database' },
  {
    original: 'Firebase',
    normalized: 'Firebase',
    aliases: ['firebase', 'firestore', 'firebase realtime'],
    category: 'database',
  },
  {
    original: 'DynamoDB',
    normalized: 'DynamoDB',
    aliases: ['dynamodb', 'dynamo db', 'aws dynamodb'],
    category: 'database',
  },
  {
    original: 'Elasticsearch',
    normalized: 'Elasticsearch',
    aliases: ['elasticsearch', 'elastic search', 'opensearch'],
    category: 'database',
  },
  {
    original: 'Prisma',
    normalized: 'Prisma',
    aliases: ['prisma', 'prisma orm'],
    category: 'database',
  },
  {
    original: 'SQL',
    normalized: 'SQL',
    aliases: ['sql', 't-sql', 'plpgsql', 'pl/pgsql'],
    category: 'database',
  },

  // ─── Cloud ────────────────────────────────────────────────────────────────
  {
    original: 'AWS',
    normalized: 'AWS',
    aliases: ['aws', 'amazon web services', 'amazon aws'],
    category: 'cloud',
  },
  {
    original: 'Google Cloud',
    normalized: 'Google Cloud',
    aliases: ['gcp', 'google cloud', 'google cloud platform', 'gcs'],
    category: 'cloud',
  },
  {
    original: 'Azure',
    normalized: 'Azure',
    aliases: ['azure', 'microsoft azure', 'ms azure'],
    category: 'cloud',
  },
  { original: 'Vercel', normalized: 'Vercel', aliases: ['vercel'], category: 'cloud' },
  { original: 'Netlify', normalized: 'Netlify', aliases: ['netlify'], category: 'cloud' },
  { original: 'Heroku', normalized: 'Heroku', aliases: ['heroku'], category: 'cloud' },
  {
    original: 'DigitalOcean',
    normalized: 'DigitalOcean',
    aliases: ['digitalocean', 'digital ocean', 'do'],
    category: 'cloud',
  },
  {
    original: 'Cloudflare',
    normalized: 'Cloudflare',
    aliases: ['cloudflare', 'cloudflare workers', 'cf workers'],
    category: 'cloud',
  },

  // ─── DevOps ───────────────────────────────────────────────────────────────
  {
    original: 'Docker',
    normalized: 'Docker',
    aliases: ['docker', 'docker compose', 'dockerfile'],
    category: 'devops',
  },
  {
    original: 'Kubernetes',
    normalized: 'Kubernetes',
    aliases: ['kubernetes', 'k8s', 'kubectl'],
    category: 'devops',
  },
  {
    original: 'CI/CD',
    normalized: 'CI/CD',
    aliases: ['ci/cd', 'ci cd', 'github actions', 'gitlab ci', 'jenkins', 'circleci', 'travis ci'],
    category: 'devops',
  },
  {
    original: 'Terraform',
    normalized: 'Terraform',
    aliases: ['terraform', 'iac', 'infrastructure as code'],
    category: 'devops',
  },
  {
    original: 'Linux',
    normalized: 'Linux',
    aliases: ['linux', 'ubuntu', 'debian', 'centos', 'bash scripting', 'shell scripting'],
    category: 'devops',
  },
  {
    original: 'Nginx',
    normalized: 'Nginx',
    aliases: ['nginx', 'nginx config'],
    category: 'devops',
  },
  {
    original: 'Git',
    normalized: 'Git',
    aliases: ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
    category: 'devops',
  },

  // ─── AI / ML ──────────────────────────────────────────────────────────────
  {
    original: 'OpenAI',
    normalized: 'OpenAI',
    aliases: ['openai', 'open ai', 'chatgpt api', 'gpt-4', 'gpt4'],
    category: 'ai_ml',
  },
  {
    original: 'Claude',
    normalized: 'Claude (Anthropic)',
    aliases: ['claude', 'anthropic', 'claude api'],
    category: 'ai_ml',
  },
  {
    original: 'LangChain',
    normalized: 'LangChain',
    aliases: ['langchain', 'lang chain'],
    category: 'ai_ml',
  },
  {
    original: 'Machine Learning',
    normalized: 'Machine Learning',
    aliases: ['machine learning', 'ml', 'supervised learning', 'unsupervised learning'],
    category: 'ai_ml',
  },
  {
    original: 'TensorFlow',
    normalized: 'TensorFlow',
    aliases: ['tensorflow', 'tensor flow', 'tf'],
    category: 'ai_ml',
  },
  {
    original: 'PyTorch',
    normalized: 'PyTorch',
    aliases: ['pytorch', 'py torch'],
    category: 'ai_ml',
  },
  {
    original: 'Hugging Face',
    normalized: 'Hugging Face',
    aliases: ['hugging face', 'huggingface', 'transformers'],
    category: 'ai_ml',
  },
  {
    original: 'Prompt Engineering',
    normalized: 'Prompt Engineering',
    aliases: ['prompt engineering', 'prompt design', 'llm prompting'],
    category: 'ai_ml',
  },
  {
    original: 'RAG',
    normalized: 'RAG (Retrieval-Augmented Generation)',
    aliases: ['rag', 'retrieval augmented generation', 'vector search', 'embeddings'],
    category: 'ai_ml',
  },
  {
    original: 'Computer Vision',
    normalized: 'Computer Vision',
    aliases: ['computer vision', 'image recognition', 'opencv'],
    category: 'ai_ml',
  },

  // ─── Automation ───────────────────────────────────────────────────────────
  { original: 'Zapier', normalized: 'Zapier', aliases: ['zapier', 'zaps'], category: 'automation' },
  {
    original: 'Make.com',
    normalized: 'Make.com',
    aliases: ['make', 'make.com', 'integromat'],
    category: 'automation',
  },
  { original: 'n8n', normalized: 'n8n', aliases: ['n8n', 'n8n.io'], category: 'automation' },
  {
    original: 'GoHighLevel',
    normalized: 'GoHighLevel',
    aliases: ['gohighlevel', 'go high level', 'highlevel', 'high level', 'hl'],
    category: 'automation',
  },
  {
    original: 'ActiveCampaign',
    normalized: 'ActiveCampaign',
    aliases: ['activecampaign', 'active campaign'],
    category: 'automation',
  },
  {
    original: 'Playwright',
    normalized: 'Playwright',
    aliases: ['playwright', 'puppeteer', 'selenium', 'cypress'],
    category: 'automation',
  },

  // ─── CRM ──────────────────────────────────────────────────────────────────
  {
    original: 'Salesforce',
    normalized: 'Salesforce',
    aliases: ['salesforce', 'sfdc', 'salesforce crm', 'apex'],
    category: 'crm',
  },
  { original: 'HubSpot', normalized: 'HubSpot', aliases: ['hubspot', 'hub spot'], category: 'crm' },
  { original: 'Zoho', normalized: 'Zoho', aliases: ['zoho', 'zoho crm'], category: 'crm' },
  { original: 'Pipedrive', normalized: 'Pipedrive', aliases: ['pipedrive'], category: 'crm' },
  {
    original: 'Monday.com',
    normalized: 'Monday.com',
    aliases: ['monday', 'monday.com'],
    category: 'crm',
  },
  { original: 'Airtable', normalized: 'Airtable', aliases: ['airtable'], category: 'crm' },

  // ─── Marketing ────────────────────────────────────────────────────────────
  {
    original: 'SEO',
    normalized: 'SEO',
    aliases: ['seo', 'search engine optimization', 'technical seo'],
    category: 'marketing',
  },
  {
    original: 'Google Ads',
    normalized: 'Google Ads',
    aliases: ['google ads', 'google adwords', 'adwords', 'ppc'],
    category: 'marketing',
  },
  {
    original: 'Facebook Ads',
    normalized: 'Facebook Ads',
    aliases: ['facebook ads', 'meta ads', 'fb ads'],
    category: 'marketing',
  },
  {
    original: 'Email Marketing',
    normalized: 'Email Marketing',
    aliases: ['email marketing', 'mailchimp', 'klaviyo', 'sendgrid'],
    category: 'marketing',
  },
  {
    original: 'Content Marketing',
    normalized: 'Content Marketing',
    aliases: ['content marketing', 'content strategy', 'content creation'],
    category: 'marketing',
  },
  {
    original: 'Google Analytics',
    normalized: 'Google Analytics',
    aliases: ['google analytics', 'ga4', 'gtm', 'google tag manager'],
    category: 'analytics',
  },

  // ─── Design ───────────────────────────────────────────────────────────────
  {
    original: 'Figma',
    normalized: 'Figma',
    aliases: ['figma', 'figma design'],
    category: 'design',
  },
  {
    original: 'Adobe Photoshop',
    normalized: 'Adobe Photoshop',
    aliases: ['photoshop', 'ps', 'adobe photoshop'],
    category: 'design',
  },
  {
    original: 'Adobe Illustrator',
    normalized: 'Adobe Illustrator',
    aliases: ['illustrator', 'ai', 'adobe illustrator'],
    category: 'design',
  },
  {
    original: 'UI/UX Design',
    normalized: 'UI/UX Design',
    aliases: [
      'ui/ux',
      'ui ux',
      'user interface design',
      'user experience design',
      'ux design',
      'ui design',
    ],
    category: 'design',
  },
  { original: 'Webflow', normalized: 'Webflow', aliases: ['webflow'], category: 'design' },
  { original: 'Canva', normalized: 'Canva', aliases: ['canva'], category: 'design' },

  // ─── Analytics ────────────────────────────────────────────────────────────
  {
    original: 'Data Analysis',
    normalized: 'Data Analysis',
    aliases: ['data analysis', 'data analytics', 'data analyst'],
    category: 'analytics',
  },
  {
    original: 'Tableau',
    normalized: 'Tableau',
    aliases: ['tableau', 'tableau desktop'],
    category: 'analytics',
  },
  {
    original: 'Power BI',
    normalized: 'Power BI',
    aliases: ['power bi', 'powerbi', 'microsoft power bi'],
    category: 'analytics',
  },
  {
    original: 'SQL Analytics',
    normalized: 'SQL Analytics',
    aliases: ['bigquery', 'snowflake', 'dbt', 'looker'],
    category: 'analytics',
  },
  {
    original: 'Excel/Sheets',
    normalized: 'Excel/Sheets',
    aliases: ['excel', 'google sheets', 'spreadsheets', 'microsoft excel'],
    category: 'analytics',
  },

  // ─── Finance ──────────────────────────────────────────────────────────────
  {
    original: 'QuickBooks',
    normalized: 'QuickBooks',
    aliases: ['quickbooks', 'quick books', 'qbo'],
    category: 'finance',
  },
  { original: 'Xero', normalized: 'Xero', aliases: ['xero'], category: 'finance' },
  {
    original: 'Bookkeeping',
    normalized: 'Bookkeeping',
    aliases: ['bookkeeping', 'accounts payable', 'accounts receivable'],
    category: 'finance',
  },
  {
    original: 'Financial Modeling',
    normalized: 'Financial Modeling',
    aliases: ['financial modeling', 'financial modelling', 'dcf', 'valuation'],
    category: 'finance',
  },

  // ─── Writing ──────────────────────────────────────────────────────────────
  {
    original: 'Copywriting',
    normalized: 'Copywriting',
    aliases: ['copywriting', 'copy writing', 'sales copy'],
    category: 'writing',
  },
  {
    original: 'Technical Writing',
    normalized: 'Technical Writing',
    aliases: ['technical writing', 'tech writing', 'documentation'],
    category: 'writing',
  },
  {
    original: 'Content Writing',
    normalized: 'Content Writing',
    aliases: ['content writing', 'blog writing', 'article writing'],
    category: 'writing',
  },
  {
    original: 'Ghostwriting',
    normalized: 'Ghostwriting',
    aliases: ['ghostwriting', 'ghost writing'],
    category: 'writing',
  },

  // ─── Project Management ───────────────────────────────────────────────────
  {
    original: 'Project Management',
    normalized: 'Project Management',
    aliases: ['project management', 'pm', 'agile', 'scrum', 'kanban'],
    category: 'pm',
  },
  {
    original: 'Jira',
    normalized: 'Jira',
    aliases: ['jira', 'confluence', 'atlassian'],
    category: 'pm',
  },
  { original: 'Notion', normalized: 'Notion', aliases: ['notion'], category: 'pm' },
  { original: 'Asana', normalized: 'Asana', aliases: ['asana'], category: 'pm' },
]

// Build lookup map: lowercase alias → entry
const _aliasMap = new Map<string, NormalizedSkillEntry>()
for (const entry of SKILL_DICTIONARY) {
  // Register the normalized name itself
  _aliasMap.set(entry.normalized.toLowerCase(), entry)
  // Register all aliases
  for (const alias of entry.aliases) {
    _aliasMap.set(alias.toLowerCase(), entry)
  }
}

export function lookupSkill(raw: string): NormalizedSkillEntry | null {
  const key = raw.toLowerCase().trim()
  return _aliasMap.get(key) ?? null
}

export function allCategories(): string[] {
  return [...new Set(SKILL_DICTIONARY.map((e) => e.category))]
}
