export interface RoastResult {
  verdict: 'hired' | 'roasted';
  score: number;
  roast_lines: string[];
  fixes: string[];
  one_liner: string;
}

export type TargetOutcome = 'hired' | 'roasted' | 'random';

// 1. Core library of 14 highly premium, distinct, and brutally funny roast personas
const ROAST_PERSONAS = [
  {
    id: 'ai-wrapper',
    keywords: ['prompt', 'gpt', 'llm', 'openai', 'copilot', 'prompt engineering', 'gpt-4', 'wrapper', 'chatgpt', 'prompts'],
    verdict: 'roasted' as const,
    score: 3,
    one_liner: "You're not an AI engineer, you're a Glorified API wrapper salesman who copies and pastes OpenAI API calls.",
    roast_lines: [
      "Listed 'Prompt Engineering' as a core technical skill. That's literally just talking to a computer in plain English, congratulations on learning to write.",
      "Co-founded an AI startup that just puts a thin premium skin over Claude 3.5. We all know your 'proprietary models' are just system instructions.",
      "Claims to build 'autonomous agents' but your GitHub contribution graph looks like a very sad desert with two green dots.",
      "Used the word 'disrupt' four times in your bio. The only thing you're disrupting is the productivity of your teammates."
    ],
    fixes: [
      "Remove 'AI Visionary' from your headline. Write some actual C++ or Python code that doesn't involve `import openai`.",
      "Build a project that works completely offline so we know you actually understand algorithms, not just third-party API rate limits.",
      "Delete 'Prompt Specialist' and replace it with a skill that takes longer than 15 minutes of scrolling TikTok to learn."
    ]
  },
  {
    id: 'crypto-casino',
    keywords: ['crypto', 'web3', 'blockchain', 'solana', 'nft', 'dao', 'token', 'hustler', 'trading'],
    verdict: 'roasted' as const,
    score: 2,
    one_liner: "A liquidator's dream. Your entire career is a leveraged bet on JPEG collections and rug pulls.",
    roast_lines: [
      "Your headline contains three different ticker symbols and the word 'Bullish'. This is a professional network, not a casino lobby.",
      "Listed 'Community Architect' for a Discord server of 2,000 bots and 5 actual humans trying to sell each other scam coins.",
      "Boasts about raising $2M in seed funding but glosses over the fact that the token is currently trading at -99.4% from its all-time high.",
      "You claim to specialize in 'decentralization' but your primary skill is centering a div (and even that's questionable)."
    ],
    fixes: [
      "Remove the lasers from your profile picture. It's 2026, you look like you got locked inside a Tron cabinet.",
      "List actual database experience. SQL Server, PostgreSQL, anything that doesn't require paying gas fees to query.",
      "Accept that Web3 is just slow databases with marketing budgets, and write some traditional backend services."
    ]
  },
  {
    id: 'react-packager',
    keywords: ['react', 'frontend', 'nextjs', 'css', 'tailwind', 'flexbox', 'vue', 'angular', 'svelte'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "You install a 45MB npm package just to toggle a mobile navigation drawer.",
    roast_lines: [
      "Listed 'Senior Frontend Engineer' but you get physical anxiety if you have to write a single line of raw CSS without Tailwind.",
      "Your portfolio is a beautiful, highly animated 3D masterpiece that takes 14 seconds to load and crashes mobile Safari instantly.",
      "You claim to optimize for performance but your production bundle size is larger than the software that guided Apollo 11 to the moon.",
      "You've rewritten your personal portfolio in 4 different frameworks this year, but still haven't finished a single actual feature."
    ],
    fixes: [
      "Build a website using ONLY vanilla HTML and CSS, with zero dependencies, just to prove you can.",
      "Stop using a full UI library (like Shadcn or Material UI) for simple landing pages that only need three buttons.",
      "Learn how a browser actually renders pixels instead of just complaining about React render cycles on Twitter."
    ]
  },
  {
    id: 'ex-faang',
    keywords: ['faang', 'google', 'meta', 'netflix', 'ex-google', 'ex-meta', 'ex-apple', 'ex-amazon', 'ex-netflix', 'worked at google', 'worked at meta', 'exgoogly'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "You worked at Google for 6 months 4 years ago and have made it your entire personality.",
    roast_lines: [
      "Your headline says 'Ex-Google | Builder | Angel Investor'. You were an associate contract program manager who got laid off in the first wave.",
      "You write multi-paragraph LinkedIn posts about the 'mental resilience' you learned during corporate tea-tasting sessions in the Dublin office.",
      "You wear your company fleece jacket to weekend family barbecues and non-corporate social events.",
      "Your GitHub is completely blank because you spent three years aligning button borders in internal employee feedback portals."
    ],
    fixes: [
      "Remove 'Ex-[Company]' from your headline. You are a software engineer, not a retired high school quarterback.",
      "Show me code you actually wrote yourself, rather than relying on a trillion-dollar company's reputation to get interviews.",
      "Stop posting corporate lunch menus on your social media channels. It's food, not a tech stack."
    ]
  },
  {
    id: 'thought-leader',
    keywords: ['influencer', 'thought leader', 'thought leadership', 'growth hacking', 'content creator', 'personal branding', 'keynote speaker', 'advisor'],
    verdict: 'roasted' as const,
    score: 3,
    one_liner: "The main source of carbon emissions from LinkedIn servers. Absolute pure corporate fluff.",
    roast_lines: [
      "You post daily stories written in the classic one-sentence-per-line dramatic style. 'Today I saw a dog. It had no collar. It taught me about B2B sales...'",
      "Listed 'Strategy Evangelist' as your job. That means your primary job duty is talking about work that other people are actually doing.",
      "You have a custom banner photo of yourself speaking at a local meetup of 12 people (7 of whom were looking at their phones).",
      "You constantly run LinkedIn polls asking questions like 'Should meetings be 30 or 25 minutes?' as if it's high philosophy."
    ],
    fixes: [
      "Write a post that has actual data, code, or a concrete metric instead of generic motivational platitudes.",
      "Limit your LinkedIn usage to 10 minutes a day. Spend the remaining time building something that actually functions.",
      "Delete the selfie with a 300-word story about how a spilled cup of coffee taught you about continuous deployment."
    ]
  },
  {
    id: 'rust-systems',
    keywords: ['rust', 'c++', 'systems programming', 'assembly', 'low-level dev', 'embedded systems', 'kernel dev', 'compiler engineering'],
    verdict: 'roasted' as const,
    score: 5,
    one_liner: "A memory-safe crusader who spends three weeks fighting the borrow checker to write a hello-world microservice.",
    roast_lines: [
      "You treat garbage collection as a mortal sin and judge any developer who uses a language invented after 1995.",
      "Your LinkedIn headline has three different emojis of crabs. We get it, you use Rust. Please let us write our slow Python code in peace.",
      "You boast about performance optimizations but your server processes three requests a day from your own home server.",
      "You spent 40 hours converting a 10-line Python script to Rust and saved exactly 0.0003 seconds of CPU time."
    ],
    fixes: [
      "Accept that business value is more important than microsecond latency, and that some apps are fine being written in Node.js.",
      "Stop replying 'rewrite it in Rust' to every single GitHub issue on open-source repositories.",
      "Go outside and interact with a garbage-collected real world."
    ]
  },
  {
    id: 'pixel-pusher',
    keywords: ['design', 'ui', 'ux', 'figma', 'designer', 'creative', 'adobe', 'graphics'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "Creating beautiful, multi-layered layouts that look stunning on Pinterest but are completely impossible to build in HTML.",
    roast_lines: [
      "You use 15 different shades of gray and a font size of 9px because it looks 'clean'. Recruiters over 40 literally cannot read your portfolio.",
      "Your designs have complex, overlapping glowing neon gradients that would require a dedicated WebGL engine to render in a browser.",
      "You write 3,000-word case studies about changing the radius of a button from 4px to 8px to 'increase emotional trust'.",
      "You have never once asked a developer if your complex micro-interactions are technically feasible before presenting them to the client."
    ],
    fixes: [
      "Learn how to build a basic webpage using HTML and CSS so you understand what is easy versus what takes 3 weeks of sleepless nights.",
      "Use a readable contrast ratio. Design for accessibility, not just for design awards on Dribbble.",
      "Talk to your frontend developers. They are your allies, not a typing pool for your creative whims."
    ]
  },
  {
    id: 'yaml-engineer',
    keywords: ['devops', 'kubernetes', 'docker', 'aws', 'terraform', 'yaml', 'ci/cd', 'cloud', 'sysadmin'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "You spend $15,000 a month on a highly redundant multi-region Kubernetes cluster to host a static resume website.",
    roast_lines: [
      "Your entire job is editing YAML files, but you list 'Cloud Architect' as your title to feel like a builder.",
      "You get excited about 'zero-downtime rolling deployments' for an internal admin panel used by exactly three customer support reps.",
      "You've configured 14 different monitoring dashboards with flashing red alerts that you've muted on Slack because they fire constantly.",
      "You spend 90% of your time trying to debug Docker network configurations that worked perfectly fine on your local machine."
    ],
    fixes: [
      "Host your personal site on Vercel or Netlify. It takes 2 minutes and costs $0. You don't need Terraform for a resume.",
      "Stop adding microservices. A single monolithic server is completely fine for a database of 200 items.",
      "Clean up your AWS bill. Delete the 12 orphaned EC2 instances you spun up for testing three months ago."
    ]
  },
  {
    id: 'quiet-quitter',
    keywords: ['corporate speak', 'corporate developer', 'enterprise software', 'quiet quitter', 'quiet quitting', 'jira warrior'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "A master of moving Jira tickets from 'In Progress' to 'Blocker' with minimal muscular effort.",
    roast_lines: [
      "You've been in your current role for 4 years but your primary accomplishment is 'assisted in upgrading internal dependency libraries'.",
      "Your profile description is written in passive corporate speak: 'Participated in cross-departmental alignment strategies to facilitate product delivery'.",
      "Your average response time on Slack is 3.5 hours, but you are active on the company's #pets channel within 45 seconds of a dog photo.",
      "You list 'Time Management' as a top skill because you manage to leave the office at precisely 4:59 PM every single day."
    ],
    fixes: [
      "Build something from scratch outside of work to remind yourself what it feels like to actually create something.",
      "Update your bio with a concrete, proactive achievement: 'Initiated X', 'Refactored Y', rather than just 'supported Z'.",
      "Turn your Slack notifications back on."
    ]
  },
  {
    id: 'bootcamper',
    keywords: ['student developer', 'software intern', 'university student', 'aspiring dev', 'bootcamp grad', 'bootcamp graduate', 'intern', 'student', 'internship', 'university', 'college'],
    verdict: 'roasted' as const,
    score: 5,
    one_liner: "Your passion is inspiring, but your 'Incoming Software Engineer Intern' title is counting chickens before they hatch.",
    roast_lines: [
      "Your resume states you are an 'Aspiring Full Stack Ninja'. You haven't even finished your basic data structures class, please calm down.",
      "Listed 'Microsoft Office Excel' as a top technology. What's next? 'Double-clicking icons' and 'Powering on a computer'?",
      "Your GitHub is populated exclusively by university homework assignments named 'Homework3_Final_v2_DEFINITIVE.py'.",
      "You have an 'Open To Work' frame, but your primary contribution is sharing motivational quotes on LinkedIn instead of coding."
    ],
    fixes: [
      "Build a real project that has actual users (yes, even 5 users counts) instead of another Todo List or Weather App.",
      "Clean up your GitHub. Delete the assignment repos and pin one high-quality, fully documented project.",
      "Stop calling yourself a 'Ninja' or 'Guru'. You're a junior dev. It's a great thing to be—embrace learning instead of marketing."
    ]
  },
  {
    id: 'data-scientist',
    keywords: ['python', 'data science', 'machine learning', 'pytorch', 'tensor', 'numpy', 'jupyter', 'sagemaker', 'tensorflow', 'deep learning', 'artificial intelligence'],
    verdict: 'roasted' as const,
    score: 3,
    one_liner: "You think you're an AI researcher but your entire job is importing Scikit-Learn and running `.fit()` on clean CSV files.",
    roast_lines: [
      "Your LinkedIn says 'AI Research Scientist' but your daily work is drawing red boxes around traffic lights in Jupyter Notebooks.",
      "Your GitHub is an absolute crime scene of `.ipynb` files containing 400 lines of messy, undocumented copy-pasted StackOverflow code.",
      "You claim to understand neural networks but you get nervous if someone asks you to explain the mathematical proof of backpropagation.",
      "You spend $2,000 of company cloud credits training models that achieve 92% accuracy, when a simple SQL query could achieve 90% in 1 second."
    ],
    fixes: [
      "Learn standard software engineering principles. Write clean, modular Python modules (`.py` files) instead of chaotic Jupyter Notebooks.",
      "Stop calling yourself an 'AI Researcher' if you are just fine-tuning pre-trained models. You're an AI consumer—embrace it.",
      "Write unit tests for your data pipelines so they don't break every time the CSV schema changes."
    ]
  },
  {
    id: 'data-engineer',
    keywords: ['data engineering', 'spark', 'kafka', 'hadoop', 'pipeline', 'pipelines', 'etl', 'airflow', 'data warehouse', 'databricks', 'snowflake', 'data engineer', 'comprehend', 'rekognition'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "You build complex distributed data pipelines just to move 50 rows of data from an Excel sheet to a database.",
    roast_lines: [
      "Listed Apache Spark and Kafka for a dataset that could easily fit in a single SQL table or even a browser local storage.",
      "Your entire career is built around cleaning messy CSV files and calling it 'advanced data architecture'.",
      "You spend weeks configuring Airflow DAGs and orchestration systems for tasks that could have been a simple cron job.",
      "Claims to optimize 'scalable data workflows' but your pipelines break the moment a column header has a lowercase letter."
    ],
    fixes: [
      "Stop using Spark cluster instances for data sizes that can be processed in a standard Python loop.",
      "Learn database indexing and normal forms instead of just throwing more database clusters at slow queries.",
      "Write integration tests for your data schemas so your pipelines don't crash every Monday morning."
    ]
  },
  {
    id: 'typescript-dd',
    keywords: ['typescript', 'java', 'c#', 'object-oriented', 'clean architecture', 'domain-driven design', 'design patterns'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "Spending 4 hours writing complex, nested TypeScript utility types and abstract interfaces to build a single static form.",
    roast_lines: [
      "Your bio mentions 'Clean Architecture' and 'Domain-Driven Design'. Your codebase is a maze of folders with one-line helper functions.",
      "You get upset in code reviews if a teammate uses `any` or didn't write an abstract class interface for a utility function that prints logs.",
      "You spend more time configuring ESLint, Prettier, and Husky Git hooks than you do writing actual functional code.",
      "Your TypeScript code has so many generic parameters (`T extends K ? V : U`) that it looks like math homework from another dimension."
    ],
    fixes: [
      "Ship features. A messy codebase that works and has users is worth infinitely more than a perfectly typed repo that is 6 months late.",
      "Use `any` when it actually makes sense to move fast. Pragmatism is a senior engineering skill, perfectionism is a junior trap.",
      "Read standard production codebases to see how simple, clean code can actually be."
    ]
  },
  {
    id: 'agile-scrum',
    keywords: ['agile', 'scrum master', 'pmp', 'product manager', 'scrum synergy', 'ceo', 'co-founder', 'founder', 'thought leader'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "A master of scheduled meetings who turns 5-minute technical clarifications into 1-hour standups.",
    roast_lines: [
      "Claims to 'drive cross-functional alignment.' Translation: You write JIRA tickets that developers actively ignore.",
      "Proudly lists 'Certified Scrum Product Owner' which is a certificate you got for sitting through a 2-day Zoom seminar while muted.",
      "Your profile summary is written in the third person, as if you have a personal publicist. 'Jordan is a visionary leader who...'. No, you're not.",
      "You list 'Thought Leadership' as an endorsement. Leadership requires people following you, and currently, no one is looking."
    ],
    fixes: [
      "Schedule 50% fewer meetings this week. Let your developers actually write code for once.",
      "Rewrite your bio in the first person. You sound like you're writing your own eulogy.",
      "List a concrete metric of value that doesn't involve 'facilitated discussions' or 'curated roadmaps'."
    ]
  },
  {
    id: 'excel-analyst',
    keywords: ['excel', 'data entry', 'excel analyst', 'powerpoint', 'word', 'office'],
    verdict: 'roasted' as const,
    score: 4,
    one_liner: "The spreadsheet warrior. You've automated nothing and manually copy cells for 40 hours a week.",
    roast_lines: [
      "Listed 'Advanced Excel' because you know how to use VLOOKUP. Welcome to 2004, wait till you hear about INDEX MATCH or Python.",
      "You claim to perform 'Deep Business Intelligence' but your dashboard is just 3 pie charts colored in high-contrast primaries.",
      "Listed 'Detail Oriented' but you have a typo in your current job description. 'Responsible for leadign data pipelines.' Irony is dead.",
      "Your bio says you 'thrive in fast-paced environments.' We both know your department takes 3 weeks to approve a font change in a slide deck."
    ],
    fixes: [
      "Learn SQL immediately. Relying entirely on Excel sheets is like riding a tricycle on the highway.",
      "Correct the typos in your job history. It's the bare minimum for a 'detail-oriented data professional'.",
      "Learn Python's pandas library or R to bring your data analysis into the current decade."
    ]
  }
];

// 2. High-fidelity hired personas
const HIRED_PROFILES = [
  {
    verdict: 'hired' as const,
    score: 9,
    one_liner: "Finally, a profile that doesn't make me want to throw my coffee monitor-bound.",
    roast_lines: [
      "Your GitHub is green, your code is clean, and your experience actually lists numeric deliverables. I'm almost bored by how competent you are.",
      "You didn't write a single 'thrilled to announce' post in your entire history. This alone makes you a top 1% candidate.",
      "Your skills section actually lists hard tech stacks you've used to deploy production code, rather than 'growth mindsets' and 'thought leadership'.",
      "Your profile picture looks approachable, normal, and like someone who wouldn't argue about code formatting on a Friday afternoon."
    ],
    fixes: [
      "Honestly, just keep doing what you're doing. Maybe ask for a raise at your current job, you deserve it.",
      "Consider writing a blog post about how you avoided corporate buzzword poisoning so others can learn from you.",
      "Stop reading roasts and go sign a premium contract somewhere."
    ]
  },
  {
    verdict: 'hired' as const,
    score: 10,
    one_liner: "You are the mythical creature recruiters write fanfiction about.",
    roast_lines: [
      "You list actual open-source contributions that have thousands of stars. We should be applying to work for YOU.",
      "Your history shows consistent progression, active mentorship, and deep architectural ownership without any fluff.",
      "No buzzwords, no corporate emojis (like 'synergy' or 'rockstar'), just pure technical and execution excellence.",
      "Your profile is clean, minimal, and tells recruiters exactly what you deliver within 5 seconds of loading."
    ],
    fixes: [
      "Change nothing. You are an absolute unicorn.",
      "Actually, maybe charge a consulting fee just to let companies interview you.",
      "Go treat yourself to a very expensive meal. You've won LinkedIn."
    ]
  }
];

// Checks if a keyword matches the text using regex word boundaries.
// This prevents short strings like 'ai' from matching 'maintain' or 'training'.
function matchKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const hasSpecialSymbols = /[^a-zA-Z0-9]/.test(keyword);
  
  if (hasSpecialSymbols) {
    return text.includes(keyword);
  }
  
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(text);
}

// Consistent string hashing algorithm
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seed-based pseudo-random number generator (LCG)
function createRandom(seedStr: string) {
  let hash = hashString(seedStr);
  return function() {
    hash = (hash * 1664525 + 1013904223) % 4294967296;
    return hash / 4294967296;
  };
}

const TECH_KEYWORDS = [
  'react', 'typescript', 'javascript', 'python', 'aws', 'docker', 'kubernetes',
  'figma', 'excel', 'rust', 'c++', 'java', 'c#', 'sql', 'nextjs', 'tailwind',
  'html', 'css', 'vue', 'angular', 'svelte', 'terraform', 'git', 'node', 'django',
  'sagemaker', 'pytorch', 'tensorflow', 'quicksight', 'openai', 'llm', 'gemini'
];

const BUZZWORDS = [
  'disrupt', 'synergy', 'passionate', 'driven', 'ninja', 'guru', 'strategic',
  'thought leader', 'solutions', 'innovated', 'motivated', 'results-oriented',
  'team player', 'expert', 'dynamic', 'detail-oriented', 'visionary', 'evangelist',
  'resilience', 'champion', 'spearheaded'
];

function extractProfileDetails(text: string) {
  const lowerText = text.toLowerCase();
  
  // Extract technologies
  const techs = TECH_KEYWORDS.filter(tech => {
    const escaped = tech.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(lowerText);
  });
  
  // Extract buzzwords
  const buzzes = BUZZWORDS.filter(buzz => {
    const escaped = buzz.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(lowerText);
  });
  
  // Extract years of experience
  let years = '';
  const yearsRegex = /(\d+)\+?\s*years?/i;
  const match = text.match(yearsRegex);
  if (match) {
    years = match[1];
  }
  
  // Extract job title
  let title = '';
  
  // Try pattern matching first for highly accurate custom titles (e.g. "As a Data Engineering and AWS Intern,")
  const titleMatch = text.match(/(?:as|i\s+am|working\s+as)\s+a\s+([^,.\n]+)/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
    // Clean up title if it's too long
    if (title.length > 50) {
      title = title.substring(0, 50);
    }
  }
  
  // Fallback to static list matching
  if (!title) {
    const titles = [
      'software engineer', 'developer', 'frontend engineer', 'backend engineer',
      'full stack developer', 'data scientist', 'product manager', 'scrum master',
      'designer', 'ui/ux designer', 'devops engineer', 'analyst', 'founder', 'ceo',
      'creator', 'intern', 'student'
    ];
    for (const t of titles) {
      if (lowerText.includes(t)) {
        title = t;
        break;
      }
    }
  }
  
  return {
    techs: techs.length > 0 ? techs : ['coding'],
    buzzes: buzzes.length > 0 ? buzzes : ['innovation'],
    years: years || 'some',
    title: title || 'professional'
  };
}

function generateDynamicRoast(
  details: ReturnType<typeof extractProfileDetails>,
  searchContent: string,
  random: () => number,
  basePersona: typeof ROAST_PERSONAS[0]
) {
  const primaryTech = details.techs[0];
  let secondaryTech = details.techs[1] || '';
  if (!secondaryTech) {
    const otherTechs = TECH_KEYWORDS.filter(t => t !== primaryTech);
    const hashIdx = hashString(primaryTech) % otherTechs.length;
    secondaryTech = otherTechs[hashIdx];
  }

  const primaryBuzz = details.buzzes[0];
  let secondaryBuzz = details.buzzes[1] || '';
  if (!secondaryBuzz) {
    const otherBuzzes = BUZZWORDS.filter(b => b !== primaryBuzz);
    const hashIdx = hashString(primaryBuzz) % otherBuzzes.length;
    secondaryBuzz = otherBuzzes[hashIdx];
  }

  const title = details.title;
  const years = details.years;
  const lowerText = searchContent.toLowerCase();

  const dynamicPool = [
    `Claims to be a ${title}, but your description reads like you've mostly been copy-pasting ${primaryTech} code from StackOverflow.`,
    `Using the word '${primaryBuzz}' in combination with ${primaryTech} is a bold strategy. The only thing you're '${primaryBuzz}'ing is the patience of hiring managers.`,
    `You boast about your '${primaryBuzz}' workflow, but your primary contribution seems to be turning coffee into unresolved git merge conflicts.`,
    `Your bio reads like an SEO keyword-stuffing project for '${primaryTech}', '${primaryBuzz}', and '${secondaryBuzz}'.`,
    `You listed '${secondaryTech}' on your profile, presumably to scare away recruiters who actually understand how it works.`,
    `The amount of '${primaryBuzz}' in your profile is single-handedly keeping the corporate synergy industry alive.`,
    `A ${title} who lists '${primaryTech}' as a core competency is like a driver listing 'steering the wheel' as a special skill.`,
    `If I had a dollar for every time you used the word '${primaryBuzz}', I could afford to pay someone to actually read your entire profile.`,
    `Claims to have ${years === 'some' ? 'a lot of' : years + ' years of'} experience, yet you still write about ${primaryTech} like you just finished a weekend bootcamp.`,
    `You talk about '${primaryBuzz}' and 'leadership', but you probably get nervous when someone asks you to explain what your ${primaryTech} app actually does.`
  ];

  // Pick 3 lines from the dynamic pool
  const selectedDynamicLines: string[] = [];
  const poolCopy = [...dynamicPool];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(random() * poolCopy.length);
    selectedDynamicLines.push(poolCopy.splice(idx, 1)[0]);
  }

  const STATIC_ROLES = [
    'AI Visionary', 'AI engineer', 'Prompt Specialist', 'Community Architect',
    'Senior Frontend Engineer', 'Cloud Architect', 'Strategy Evangelist',
    'AI Research Scientist', 'Aspiring Full Stack Ninja', 'Incoming Software Engineer Intern',
    'Certified Scrum Product Owner', 'detail-oriented data professional',
    'software engineer', 'developer', 'frontend engineer', 'backend engineer',
    'Data Scientist', 'Scrum Master', 'Product Manager', 'designer'
  ];

  // Customize the base persona's roast lines
  const customizedPersonaLines = basePersona.roast_lines.map(line => {
    let customizedLine = line;
    for (const role of STATIC_ROLES) {
      const isSimpleWord = /^[a-z]+$/i.test(role) || role.toLowerCase() === 'software engineer';
      const pattern = isSimpleWord ? `\\b${role}\\b` : role;
      const regex = new RegExp(pattern, 'gi');
      customizedLine = customizedLine.replace(regex, title);
    }
    return customizedLine
      .replace(/Prompt Engineering/gi, `${primaryTech} engineering`)
      .replace(/Claude 3\.5/gi, primaryTech)
      .replace(/Tailwind/gi, primaryTech === 'css' || primaryTech === 'html' ? 'raw hex codes' : 'Tailwind')
      .replace(/React/gi, primaryTech)
      .replace(/disrupt/gi, primaryBuzz)
      .replace(/synergy/gi, primaryBuzz)
      .replace(/SQL/gi, primaryTech)
      .replace(/Kubernetes/gi, primaryTech)
      .replace(/Jira/gi, 'Jira')
      .replace(/Figma/gi, primaryTech)
      .replace(/Excel/gi, primaryTech);
  });

  // Pick 3 lines from the customized persona lines
  const selectedPersonaLines: string[] = [];
  const personaCopy = [...customizedPersonaLines];
  for (let i = 0; i < 3; i++) {
    if (personaCopy.length > 0) {
      const idx = Math.floor(random() * personaCopy.length);
      selectedPersonaLines.push(personaCopy.splice(idx, 1)[0]);
    }
  }

  // Inject hyper-targeted items based on specific high-value achievements
  const targetedRoasts: string[] = [];
  const targetedFixes: string[] = [];

  if (lowerText.includes('ambassador') || lowerText.includes('community builder') || lowerText.includes('ambassador')) {
    targetedRoasts.push(
      `An AWS Ambassador and Community Builder? So your main job is writing free marketing blogs for AWS in exchange for hoodies and stickers.`
    );
    targetedFixes.push(
      "Stop spending your weekends writing tutorial blogs for AWS credits and go build an actual revenue-generating product."
    );
  }

  if (lowerText.includes('certifications') || lowerText.includes('jacket') || lowerText.includes('certified')) {
    targetedRoasts.push(
      `12 AWS Certifications and a Golden Jacket? Congratulations on passing 12 multiple-choice exams, but can you actually debug a production incident without looking at StackOverflow?`
    );
    targetedFixes.push(
      "Hang up the AWS Golden Jacket and focus on building actual systems instead of collecting PDF badges."
    );
  }

  if (lowerText.includes('architect') || lowerText.includes('architecture')) {
    targetedRoasts.push(
      `As a Solution Architect, you draw beautiful boxes and arrows in Lucidchart, but developers have to actually write the code to fix your unfeasible multi-region designs.`
    );
  }

  if (lowerText.includes('community') || lowerText.includes('meetup') || lowerText.includes('organizer') || lowerText.includes('user group')) {
    targetedRoasts.push(
      `Organized a community day for 650 people? That's a massive amount of coordination just to get developers to network over stale pizza and talk about Kubernetes.`
    );
  }

  const finalRoastLines = [...targetedRoasts, ...selectedPersonaLines, ...selectedDynamicLines];

  // Customize the one-liner
  let oneLiner = basePersona.one_liner;
  for (const role of STATIC_ROLES) {
    const isSimpleWord = /^[a-z]+$/i.test(role) || role.toLowerCase() === 'software engineer';
    const pattern = isSimpleWord ? `\\b${role}\\b` : role;
    const regex = new RegExp(pattern, 'gi');
    oneLiner = oneLiner.replace(regex, title);
  }
  oneLiner = oneLiner
    .replace(/AI engineer/gi, `${primaryTech} developer`)
    .replace(/OpenAI/gi, primaryTech)
    .replace(/JPEG/gi, primaryTech)
    .replace(/npm package/gi, `${primaryTech} package`)
    .replace(/Figma/gi, primaryTech)
    .replace(/YAML/gi, primaryTech)
    .replace(/Jira/gi, 'Jira')
    .replace(/Excel/gi, primaryTech);

  // Customize fixes
  const dynamicFixPool = [
    `Delete the word '${primaryBuzz}' from your profile and replace it with an actual metric of value.`,
    `Stop listing '${primaryTech}' if your experience with it is limited to looking at a tutorial homepage.`,
    `Write a bio that sounds like a human wrote it, not an AI prompted with 'make me sound professional'.`,
    `Remove '${primaryTech}' and '${secondaryTech}' from your headline unless you can write a script in them in under 5 minutes.`,
    `Delete the dramatic one-sentence paragraphs. You are a ${title}, not a LinkedIn influencer.`
  ];

  const selectedFixes: string[] = [...targetedFixes];
  const fixPoolCopy = [...dynamicFixPool];
  for (let i = 0; i < 2; i++) {
    const idx = Math.floor(random() * fixPoolCopy.length);
    selectedFixes.push(fixPoolCopy.splice(idx, 1)[0]);
  }

  const customizedPersonaFixes = basePersona.fixes.map(fix => {
    return fix
      .replace(/React/gi, primaryTech)
      .replace(/Tailwind/gi, primaryTech)
      .replace(/Figma/gi, primaryTech)
      .replace(/Terraform/gi, primaryTech)
      .replace(/SQL/gi, primaryTech)
      .replace(/Python/gi, primaryTech)
      .replace(/Excel/gi, primaryTech)
      .replace(/Slack/gi, 'Slack');
  });

  for (const fix of customizedPersonaFixes) {
    if (selectedFixes.length < 5) {
      selectedFixes.push(fix);
    }
  }

  // Calculate a dynamic score seeded by input and modified by seniority
  let baseScore = basePersona.score;
  if (lowerText.includes('architect') || lowerText.includes('senior') || lowerText.includes('lead')) {
    baseScore += 2;
  }
  if (lowerText.includes('years of experience') || lowerText.includes('years of dev') || /7\+?\s*years/i.test(lowerText)) {
    baseScore += 1;
  }
  if (lowerText.includes('certifications') || lowerText.includes('certified')) {
    baseScore += 1;
  }

  const scoreOffset = Math.floor(random() * 3) - 1; // -1, 0, or 1
  const finalScore = Math.max(1, Math.min(10, baseScore + scoreOffset));

  return {
    one_liner: oneLiner,
    roast_lines: Array.from(new Set(finalRoastLines)).slice(0, 6),
    fixes: Array.from(new Set(selectedFixes)).slice(0, 5),
    score: finalScore
  };
}

function generateDynamicHired(
  details: ReturnType<typeof extractProfileDetails>,
  searchContent: string,
  random: () => number,
  baseProfile: typeof HIRED_PROFILES[0]
) {
  const primaryTech = details.techs[0];
  const title = details.title;
  const lowerText = searchContent.toLowerCase();

  const customizedLines = baseProfile.roast_lines.map(line => {
    return line
      .replace(/GitHub/gi, 'GitHub')
      .replace(/tech stacks/gi, `${primaryTech} stacks`);
  });

  const dynamicHiredLines = [
    `Your experience with ${primaryTech} actually looks practical, not just theoretical book learning.`,
    `Successfully avoided adding unnecessary buzzwords to your ${title} description. A rare sight.`,
    `A ${title} who writes clean code and lists concrete results instead of empty philosophies.`
  ];

  if (lowerText.includes('ambassador') || lowerText.includes('builder')) {
    dynamicHiredLines.unshift(
      `Your active tech advocacy as an AWS Ambassador is outstanding and shows true leadership.`
    );
  }
  if (lowerText.includes('certifications') || lowerText.includes('certified')) {
    dynamicHiredLines.unshift(
      `Impressive credentials including Solutions Architect Professional certification.`
    );
  }

  const selectedHiredLines: string[] = [];
  const pool = [...customizedLines];
  for (let i = 0; i < 3; i++) {
    if (pool.length > 0) {
      const idx = Math.floor(random() * pool.length);
      selectedHiredLines.push(pool.splice(idx, 1)[0]);
    }
  }
  
  const dynamicPool = [...dynamicHiredLines];
  for (let i = 0; i < 2; i++) {
    const idx = Math.floor(random() * dynamicPool.length);
    selectedHiredLines.push(dynamicPool.splice(idx, 1)[0]);
  }

  const baseScore = baseProfile.score;
  const scoreOffset = Math.floor(random() * 2); // 0 or 1
  const finalScore = Math.max(8, Math.min(10, baseScore + scoreOffset));

  return {
    ...baseProfile,
    score: finalScore,
    roast_lines: Array.from(new Set(selectedHiredLines)).slice(0, 5)
  };
}

/**
 * Service to process LinkedIn profiles.
 * Seamlessly integrates local mock engine and live AWS Bedrock.
 */
export async function roastProfile(
  input: { type: 'url'; data: string } | { type: 'file'; name: string; content: string } | { type: 'text'; data: string },
  outcome: TargetOutcome = 'random'
): Promise<RoastResult> {
  // Check if AWS API endpoint is defined in environment variables
  let apiUrl = import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV && (!apiUrl || apiUrl.includes("execute-api"))) {
    apiUrl = "http://localhost:3001";
  }
  
  if (apiUrl) {
    try {
      const requestPayload = input.type === 'url'
        ? { type: 'url', data: input.data, outcome }
        : input.type === 'text'
          ? { type: 'text', data: input.data, fileName: 'LinkedIn About Section', outcome }
          : { type: 'file', data: input.content, fileName: input.name, outcome };

      const response = await fetch(`${apiUrl}/roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `API HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      console.error("AWS Gateway fetch failed:", error);
      // Re-throw the error so that the user receives accurate real-time feedback in the UI about quota or permissions!
      const err = error instanceof Error ? error : new Error(String(error));
      throw new Error(err.message || "Failed to communicate with live AI backend", { cause: error });
    }
  }

  // Simulate networking delay for high-fidelity experience in offline mode
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Determine key content and extract handle
  let handle: string;
  let searchContent: string;

  if (input.type === 'url') {
    searchContent = input.data.toLowerCase();
    // Extract handle: e.g. "https://www.linkedin.com/in/maitry-patel/" -> "maitry-patel"
    const parts = input.data.split('/in/');
    handle = parts[1] ? parts[1].replace(/\//g, '').trim() : input.data;
  } else if (input.type === 'text') {
    searchContent = input.data.toLowerCase();
    handle = 'LinkedIn About Section';
  } else {
    // File upload
    searchContent = `${input.name} ${input.content}`.toLowerCase();
    handle = input.name.replace(/\.[^/.]+$/, '').trim(); // Remove file extension
  }

  const details = extractProfileDetails(searchContent);
  const hashKey = input.type === 'text' ? searchContent : (handle || 'default');
  const random = createRandom(hashKey);

  // If user explicitly chose "Hired" OR (chose Random and hits the 15% random chance)
  const resolveAsHired = outcome === 'hired' || (outcome === 'random' && random() < 0.15);
  
  // 1. Scan and score each persona based on matched keywords
  const personaMatches: Array<{
    persona: typeof ROAST_PERSONAS[0];
    score: number;
    matchedKeywords: string[];
  }> = [];

  for (const persona of ROAST_PERSONAS) {
    let score = 0;
    const matched: string[] = [];
    for (const kw of persona.keywords) {
      if (matchKeyword(searchContent, kw)) {
        score++;
        matched.push(kw);
      }
    }
    if (score > 0) {
      personaMatches.push({ persona, score, matchedKeywords: matched });
    }
  }

  // Sort by match score descending
  personaMatches.sort((a, b) => b.score - a.score);

  if (outcome === 'roasted' || !resolveAsHired) {
    let selectedRoast: typeof ROAST_PERSONAS[0];
    if (personaMatches.length > 0) {
      selectedRoast = personaMatches[0].persona;
    } else {
      const index = Math.floor(random() * ROAST_PERSONAS.length);
      selectedRoast = ROAST_PERSONAS[index];
    }

    const dynamicRoast = generateDynamicRoast(details, searchContent, random, selectedRoast);

    return {
      verdict: selectedRoast.verdict,
      score: dynamicRoast.score,
      one_liner: dynamicRoast.one_liner,
      roast_lines: dynamicRoast.roast_lines,
      fixes: dynamicRoast.fixes
    };
  }

  // Otherwise, resolve as Hired
  const hiredIndex = Math.floor(random() * HIRED_PROFILES.length);
  const hiredProfile = HIRED_PROFILES[hiredIndex];

  return generateDynamicHired(details, searchContent, random, hiredProfile);
}
