'use client';

import { PromptCategory, AITool } from '@/lib/types';
import { CATEGORY_ICONS, TOOL_COLORS } from '@/lib/utils';

const CATEGORIES: (PromptCategory | 'All')[] = [
  'All', 'Writing', 'Code', 'Image', 'Research',
  'Productivity', 'Marketing', 'Education', 'Fun', 'Business', 'Other'
];

const AI_TOOLS: (AITool | 'All')[] = [
  'All', 'ChatGPT', 'Claude', 'Midjourney', 'Gemini',
  'Stable Diffusion', 'DALL-E', 'Perplexity', 'Copilot', 'Other'
];

interface SidebarProps {
  selectedCategory: PromptCategory | 'All';
  selectedTool: AITool | 'All';
  favoritesOnly: boolean;
  totalCount: number;
  filteredCount: number;
  onCategoryChange: (cat: PromptCategory | 'All') => void;
  onToolChange: (tool: AITool | 'All') => void;
  onFavoritesToggle: () => void;
  onExport: () => void;
}

export function Sidebar({
  selectedCategory,
  selectedTool,
  favoritesOnly,
  totalCount,
  filteredCount,
  onCategoryChange,
  onToolChange,
  onFavoritesToggle,
  onExport,
}: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col gap-6">
      {/* Stats */}
      <div className="bg-violet-50 rounded-2xl p-4">
        <p className="text-xs font-medium text-violet-600 uppercase tracking-wider mb-1">Library</p>
        <p className="text-2xl font-bold text-violet-900">{totalCount}</p>
        <p className="text-xs text-violet-600">prompts saved</p>
        {filteredCount !== totalCount && (
          <p className="text-xs text-violet-500 mt-1">{filteredCount} matching filters</p>
        )}
      </div>

      {/* Favorites */}
      <div>
        <button
          onClick={onFavoritesToggle}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            favoritesOnly
              ? 'bg-yellow-100 text-yellow-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>⭐</span>
          Favorites only
        </button>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          Category
        </p>
        <div className="space-y-0.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-violet-100 text-violet-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{cat === 'All' ? '📋' : CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Tools */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          AI Tool
        </p>
        <div className="space-y-0.5">
          {AI_TOOLS.map(t => (
            <button
              key={t}
              onClick={() => onToolChange(t)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                selectedTool === t
                  ? 'bg-violet-100 text-violet-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full inline-block ${
                t === 'All' ? 'bg-gray-400' :
                t === 'ChatGPT' ? 'bg-emerald-500' :
                t === 'Claude' ? 'bg-orange-500' :
                t === 'Midjourney' ? 'bg-blue-500' :
                t === 'Gemini' ? 'bg-purple-500' :
                t === 'Stable Diffusion' ? 'bg-pink-500' :
                t === 'DALL-E' ? 'bg-cyan-500' :
                t === 'Perplexity' ? 'bg-teal-500' :
                t === 'Copilot' ? 'bg-indigo-500' :
                'bg-gray-400'
              }`} />
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="mt-auto">
        <button
          onClick={onExport}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>⬇️</span>
          Export prompts
        </button>
      </div>
    </aside>
  );
}
