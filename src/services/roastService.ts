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
    keywords: ['student developer', 'software intern', 'university student', 'aspiring dev', 'bootcamp grad', 'bootcamp graduate'],
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
  const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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

/**
 * Service to process LinkedIn profiles.
 * Seamlessly integrates local mock engine and live AWS Bedrock.
 */export async function roastProfile(
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
    } catch (error: any) {
      console.error("AWS Gateway fetch failed:", error);
      // Re-throw the error so that the user receives accurate real-time feedback in the UI about quota or permissions!
      throw new Error(error.message || "Failed to communicate with live AI backend");
    }
  }

  // Simulate networking delay for high-fidelity experience in offline mode
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Determine key content and extract handle
  let handle = '';
  let searchContent = '';

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
  // If user explicitly chose "Hired" OR (chose Random and hits the 15% random chance)
  const resolveAsHired = outcome === 'hired' || (outcome === 'random' && Math.random() < 0.15);
  
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
    if (personaMatches.length > 0) {
      const primary = personaMatches[0];
      const secondary = personaMatches[1] || null;

      // Compile dynamic roast lines
      const dynamicRoastLines: string[] = [];
      const dynamicFixes: string[] = [];

      // Add primary roast lines (up to 3)
      dynamicRoastLines.push(...primary.persona.roast_lines.slice(0, 3));
      dynamicFixes.push(...primary.persona.fixes.slice(0, 3));

      // If secondary exists, take up to 2 from secondary for a rich combined profile roast!
      if (secondary) {
        dynamicRoastLines.push(...secondary.persona.roast_lines.slice(0, 2));
        dynamicFixes.push(...secondary.persona.fixes.slice(0, 2));
      }

      // Now, let's inject hyper-targeted items for specific high-value keywords!
      if (searchContent.includes('aws') || searchContent.includes('lambda')) {
        if (searchContent.includes('sagemaker') || searchContent.includes('pytorch') || searchContent.includes('tensorflow')) {
          dynamicRoastLines.push(
            "Brags about serverless ML deployments using Lambda & SageMaker, but your functions probably cold-start for 20 seconds loading PyTorch containers."
          );
        } else {
          dynamicRoastLines.push(
            "Architecting AWS solutions using S3 and Lambda is just a fancy way of saying you write glue code for cloud-hosted bucket triggers."
          );
        }
        dynamicFixes.push("Prune your AWS Lambda zip sizes and bundle dependencies to avoid 15-second cold starts.");
      }

      if (searchContent.includes('quicksight')) {
        dynamicRoastLines.push(
          "Boasting about 'real-time analytics with QuickSight' is a bold choice. We all know QuickSight is just slow-loading Excel charts with an enterprise licensing fee."
        );
        dynamicFixes.push("Stop paying for QuickSight licenses just to draw pie charts that could have been a static markdown table.");
      }

      if (searchContent.includes('sagemaker') && !searchContent.includes('aws')) {
        dynamicRoastLines.push(
          "You love SageMaker mostly because it lets you burn through company cloud computing budgets while waiting for a single training epoch."
        );
      }

      if (searchContent.includes('devops') && (searchContent.includes('ci/cd') || searchContent.includes('docker'))) {
        dynamicRoastLines.push(
          "Your CI/CD pipelines look like an absolute crime scene of failed GitHub Action runs with names like 'fix devops config v14'."
        );
        dynamicFixes.push("Stop naming your git commits 'fix yaml config' and learn to test your docker builds locally.");
      }

      // Ensure we have unique roast lines and at least 5-6 points!
      const uniqueRoastLines = Array.from(new Set(dynamicRoastLines));
      const uniqueFixes = Array.from(new Set(dynamicFixes));

      // Pad roast lines up to 6 if they are fewer
      let fallbackIdx = 0;
      while (uniqueRoastLines.length < 6 && primary.persona.roast_lines.length > 0) {
        const line = primary.persona.roast_lines[fallbackIdx % primary.persona.roast_lines.length];
        if (!uniqueRoastLines.includes(line)) {
          uniqueRoastLines.push(line);
        }
        fallbackIdx++;
        if (fallbackIdx > 12) break; // break loops
      }

      // Pad fixes up to 5 if they are fewer
      fallbackIdx = 0;
      while (uniqueFixes.length < 5 && primary.persona.fixes.length > 0) {
        const fix = primary.persona.fixes[fallbackIdx % primary.persona.fixes.length];
        if (!uniqueFixes.includes(fix)) {
          uniqueFixes.push(fix);
        }
        fallbackIdx++;
        if (fallbackIdx > 12) break; // break loops
      }

      return {
        verdict: primary.persona.verdict,
        score: primary.persona.score,
        one_liner: primary.persona.one_liner,
        roast_lines: uniqueRoastLines.slice(0, 6),
        fixes: uniqueFixes.slice(0, 5),
      };
    }

    // 2. Fallback Hashing Router if no keywords match
    const hashKey = input.type === 'text' ? searchContent : (handle || 'default');
    const index = hashString(hashKey) % ROAST_PERSONAS.length;
    const selectedRoast = ROAST_PERSONAS[index];

    return {
      verdict: selectedRoast.verdict,
      score: selectedRoast.score,
      one_liner: selectedRoast.one_liner,
      roast_lines: [...selectedRoast.roast_lines],
      fixes: [...selectedRoast.fixes],
    };
  }

  // Otherwise, resolve as Hired
  const hashKey = input.type === 'text' ? searchContent : (handle || 'default');
  const hiredIndex = hashString(hashKey) % HIRED_PROFILES.length;
  const hiredProfile = HIRED_PROFILES[hiredIndex];

  // Make hired profiles similarly rich
  if (personaMatches.length > 0) {
    const primary = personaMatches[0];
    const customizedRoasts = [...hiredProfile.roast_lines];
    if (primary.persona.id === 'data-scientist') {
      customizedRoasts.unshift("Your machine learning skills actually solve business problems, unlike most who just draw boxes in Jupyter.");
    } else if (primary.persona.id === 'yaml-engineer') {
      customizedRoasts.unshift("You actually understand DevOps and infrastructure, rather than just writing generic Terraform copy-pastes.");
    }
    return {
      ...hiredProfile,
      roast_lines: Array.from(new Set(customizedRoasts)).slice(0, 5)
    };
  }

  return hiredProfile;
}
