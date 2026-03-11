'use client';

import { useState } from 'react';
import { Prompt } from '@/lib/types';
import { TOOL_COLORS, CATEGORY_ICONS, truncate, copyToClipboard } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (prompt: Prompt) => void;
  onUse: (id: string) => void;
  viewMode: 'grid' | 'list';
}

export function PromptCard({
  prompt,
  onToggleFavorite,
  onDelete,
  onEdit,
  onUse,
  viewMode,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(prompt.content);
    onUse(prompt.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toolColor = TOOL_COLORS[prompt.tool] || TOOL_COLORS['Other'];
  const categoryIcon = CATEGORY_ICONS[prompt.category] || '✨';

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow group">
        <div className="text-2xl">{categoryIcon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{prompt.title}</h3>
              {prompt.description && (
                <p className="text-gray-500 text-xs mt-0.5">{prompt.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${toolColor}`}>
                {prompt.tool}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-2 font-mono bg-gray-50 rounded p-2 line-clamp-2">
            {truncate(prompt.content, 120)}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-wrap gap-1">
              {prompt.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleFavorite(prompt.id)}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  prompt.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                ★
              </button>
              <button
                onClick={() => onEdit(prompt)}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✏️
              </button>
              <button
                onClick={handleCopy}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all group flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{prompt.title}</h3>
            {prompt.description && (
              <p className="text-gray-400 text-xs mt-0.5 leading-tight">{truncate(prompt.description, 60)}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(prompt.id)}
          className={`text-lg transition-transform hover:scale-110 ${
            prompt.isFavorite ? 'text-yellow-500' : 'text-gray-200 hover:text-gray-400'
          }`}
        >
          ★
        </button>
      </div>

      {/* Tool badge */}
      <span className={`self-start text-xs px-2 py-1 rounded-full font-medium mb-3 ${toolColor}`}>
        {prompt.tool}
      </span>

      {/* Content preview */}
      <div className="bg-gray-50 rounded-xl p-3 mb-3 flex-1">
        <p className="text-gray-600 text-xs font-mono leading-relaxed whitespace-pre-wrap">
          {showFull ? prompt.content : truncate(prompt.content, 180)}
        </p>
        {prompt.content.length > 180 && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-violet-600 text-xs mt-1 hover:underline"
          >
            {showFull ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {prompt.tags.slice(0, 4).map(tag => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          Used {prompt.useCount}x
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(prompt)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-sm"
            title="Edit"
          >
            ✏️
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(prompt.id)}
                className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors text-sm"
              title="Delete"
            >
              🗑️
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              copied
                ? 'bg-green-100 text-green-700 scale-95'
                : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-95'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
