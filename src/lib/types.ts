export type AITool = 
  | 'ChatGPT' 
  | 'Claude' 
  | 'Midjourney' 
  | 'Gemini' 
  | 'Stable Diffusion' 
  | 'DALL-E'
  | 'Perplexity'
  | 'Copilot'
  | 'Other';

export type PromptCategory = 
  | 'Writing'
  | 'Code'
  | 'Image'
  | 'Research'
  | 'Productivity'
  | 'Marketing'
  | 'Education'
  | 'Fun'
  | 'Business'
  | 'Other';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  tool: AITool;
  category: PromptCategory;
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  useCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  promptIds: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface AppState {
  prompts: Prompt[];
  collections: Collection[];
  searchQuery: string;
  selectedCategory: PromptCategory | 'All';
  selectedTool: AITool | 'All';
  viewMode: 'grid' | 'list';
}
