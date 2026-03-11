'use client';

import { useState, useEffect } from 'react';
import { Prompt, AITool, PromptCategory } from '@/lib/types';

const AI_TOOLS: AITool[] = [
  'ChatGPT', 'Claude', 'Midjourney', 'Gemini', 
  'Stable Diffusion', 'DALL-E', 'Perplexity', 'Copilot', 'Other'
];

const CATEGORIES: PromptCategory[] = [
  'Writing', 'Code', 'Image', 'Research', 
  'Productivity', 'Marketing', 'Education', 'Fun', 'Business', 'Other'
];

interface PromptModalProps {
  prompt?: Prompt | null;
  onSave: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'useCount'>) => void;
  onClose: () => void;
}

export function PromptModal({ prompt, onSave, onClose }: PromptModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tool, setTool] = useState<AITool>('ChatGPT');
  const [category, setCategory] = useState<PromptCategory>('Writing');
  const [tagsInput, setTagsInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setDescription(prompt.description || '');
      setTool(prompt.tool);
      setCategory(prompt.category);
      setTagsInput(prompt.tags.join(', '));
      setIsPublic(prompt.isPublic);
      setIsFavorite(prompt.isFavorite);
    }
  }, [prompt]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Prompt content is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(Boolean);

    onSave({
      title: title.trim(),
      content: content.trim(),
      description: description.trim() || undefined,
      tool,
      category,
      tags,
      isPublic,
      isFavorite,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {prompt ? 'Edit Prompt' : 'New Prompt'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Code Review Expert"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                errors.title ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Tool + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">AI Tool</label>
              <select
                value={tool}
                onChange={e => setTool(e.target.value as AITool)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              >
                {AI_TOOLS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as PromptCategory)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="One line about what this prompt does"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste or write your prompt here. Use [PLACEHOLDERS] for variables."
              rows={8}
              className={`w-full px-4 py-3 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none ${
                errors.content ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.content ? (
                <p className="text-red-500 text-xs">{errors.content}</p>
              ) : (
                <p className="text-gray-400 text-xs">Use [BRACKETS] for fill-in variables</p>
              )}
              <p className="text-gray-400 text-xs">{content.length} chars</p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="code-review, engineering, best-practices"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-gray-400 text-xs mt-1">Comma-separated</p>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  isFavorite ? 'bg-yellow-400' : 'bg-gray-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5 ${
                  isFavorite ? 'translate-x-5 ml-0.5' : 'translate-x-1'
                }`} />
              </div>
              <span className="text-sm text-gray-700">Favorite</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              {prompt ? 'Save Changes' : 'Add Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
