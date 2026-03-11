import { Prompt, Collection } from './types';

const PROMPTS_KEY = 'promptbook_prompts';
const COLLECTIONS_KEY = 'promptbook_collections';

export function getPrompts(): Prompt[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(PROMPTS_KEY);
    return stored ? JSON.parse(stored) : getDefaultPrompts();
  } catch {
    return getDefaultPrompts();
  }
}

export function savePrompts(prompts: Prompt[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
}

export function getCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(COLLECTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCollections(collections: Collection[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

export function exportPrompts(prompts: Prompt[]): void {
  const data = JSON.stringify(prompts, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `promptbook-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function getDefaultPrompts(): Prompt[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'default-1',
      title: 'Code Review Expert',
      content: `You are a senior software engineer with 15 years of experience. Review the following code and provide:
1. Bugs and potential issues
2. Performance improvements
3. Security concerns
4. Best practices violations
5. Specific refactoring suggestions with examples

Be direct and specific. Show code examples for your suggestions.

Code to review:
[PASTE CODE HERE]`,
      description: 'Get thorough code reviews with actionable feedback',
      tool: 'ChatGPT',
      category: 'Code',
      tags: ['code-review', 'engineering', 'best-practices'],
      isPublic: true,
      isFavorite: true,
      useCount: 47,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'default-2',
      title: 'Blog Post Writer',
      content: `Write a compelling blog post about [TOPIC] targeting [AUDIENCE].

Requirements:
- Title with strong hook
- Intro that grabs attention in first 2 sentences
- 5-7 sections with clear headers
- Practical examples and actionable tips
- Conversational tone, no jargon
- End with a clear call-to-action
- Target length: [LENGTH] words
- SEO keyword to include naturally: [KEYWORD]`,
      description: 'Template for SEO-optimized blog posts with human tone',
      tool: 'Claude',
      category: 'Writing',
      tags: ['blog', 'seo', 'content-marketing'],
      isPublic: true,
      isFavorite: false,
      useCount: 31,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'default-3',
      title: 'Photorealistic Portrait',
      content: `Portrait of [SUBJECT DESCRIPTION], golden hour lighting, shot on Canon EOS R5 with 85mm f/1.4 lens, shallow depth of field, bokeh background, photorealistic, hyperdetailed, 8k resolution, professional photography --ar 3:4 --style raw --v 6`,
      description: 'Consistent results for photorealistic portraits in Midjourney',
      tool: 'Midjourney',
      category: 'Image',
      tags: ['portrait', 'photography', 'realistic'],
      isPublic: true,
      isFavorite: false,
      useCount: 22,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'default-4',
      title: 'Meeting Summarizer',
      content: `Summarize the following meeting transcript. Format your output as:

**Meeting Summary**
Date: [extract from transcript]
Attendees: [extract names]

**Key Decisions Made:**
- [bullet points]

**Action Items:**
| Owner | Task | Deadline |
|-------|------|----------|
| ... | ... | ... |

**Next Steps:**
[brief paragraph]

Transcript:
[PASTE TRANSCRIPT]`,
      description: 'Turns raw meeting transcripts into structured summaries',
      tool: 'ChatGPT',
      category: 'Productivity',
      tags: ['meetings', 'productivity', 'summary'],
      isPublic: true,
      isFavorite: true,
      useCount: 89,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'default-5',
      title: 'React Component Builder',
      content: `Build a React component with these specs:

Component name: [NAME]
Purpose: [WHAT IT DOES]
Props: [LIST PROPS WITH TYPES]
Behavior: [DESCRIBE INTERACTIONS]

Requirements:
- TypeScript with proper type definitions
- Tailwind CSS for styling
- Accessible (ARIA labels, keyboard nav)
- Mobile responsive
- Include usage example in a comment at the top

Stack: React 18, TypeScript, Tailwind CSS`,
      description: 'Generate production-ready React components with TypeScript and Tailwind',
      tool: 'Claude',
      category: 'Code',
      tags: ['react', 'typescript', 'component', 'frontend'],
      isPublic: true,
      isFavorite: false,
      useCount: 15,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'default-6',
      title: 'Cold Email Sequence',
      content: `Write a 3-email cold outreach sequence for:

Product/Service: [WHAT YOU SELL]
Target: [JOB TITLE at COMPANY TYPE]
Pain point I solve: [SPECIFIC PROBLEM]
Proof point: [RESULT/CASE STUDY]

Email 1 (Day 0): Problem-focused, no pitch, end with one question
Email 2 (Day 3): Value + social proof, soft CTA
Email 3 (Day 7): Breakup email, make it easy to say no

Rules: Max 5 sentences per email. No buzzwords. Real human tone.`,
      description: 'High-converting cold email sequences with natural tone',
      tool: 'ChatGPT',
      category: 'Marketing',
      tags: ['cold-email', 'sales', 'outreach'],
      isPublic: true,
      isFavorite: false,
      useCount: 12,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
