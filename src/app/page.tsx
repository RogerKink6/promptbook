'use client';

import { useState, useMemo } from 'react';
import { usePrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';
import { PromptModal } from '@/components/PromptModal';
import { Sidebar } from '@/components/Sidebar';
import { Prompt, AITool, PromptCategory } from '@/lib/types';
import { exportPrompts } from '@/lib/storage';

export default function Home() {
  const { prompts, loading, addPrompt, updatePrompt, deletePrompt, toggleFavorite, incrementUseCount, filterPrompts } =
    usePrompts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'All'>('All');
  const [selectedTool, setSelectedTool] = useState<AITool | 'All'>('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'most-used' | 'alphabetical'>('newest');

  const filtered = useMemo(() => {
    const results = filterPrompts(searchQuery, selectedCategory, selectedTool, favoritesOnly);
    return [...results].sort((a, b) => {
      if (sortBy === 'most-used') return b.useCount - a.useCount;
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filterPrompts, searchQuery, selectedCategory, selectedTool, favoritesOnly, sortBy]);

  const handleSave = (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'useCount'>) => {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, data);
    } else {
      addPrompt(data);
    }
    setEditingPrompt(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPrompt(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 animate-pulse">
            📖
          </div>
          <p className="text-gray-500 text-sm">Loading your prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
              P
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Promptbook</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Your AI prompt library</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search prompts, tags..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors active:scale-95"
          >
            <span className="text-base leading-none">+</span>
            New Prompt
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* Sidebar */}
        <Sidebar
          selectedCategory={selectedCategory}
          selectedTool={selectedTool}
          favoritesOnly={favoritesOnly}
          totalCount={prompts.length}
          filteredCount={filtered.length}
          onCategoryChange={setSelectedCategory}
          onToolChange={setSelectedTool}
          onFavoritesToggle={() => setFavoritesOnly(!favoritesOnly)}
          onExport={() => exportPrompts(prompts)}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Controls bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                {filtered.length === 0
                  ? 'No prompts found'
                  : `${filtered.length} prompt${filtered.length !== 1 ? 's' : ''}`}
              </p>
              {(searchQuery || selectedCategory !== 'All' || selectedTool !== 'All' || favoritesOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedTool('All');
                    setFavoritesOnly(false);
                  }}
                  className="text-xs text-violet-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-gray-600"
              >
                <option value="newest">Newest first</option>
                <option value="most-used">Most used</option>
                <option value="alphabetical">A → Z</option>
              </select>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    viewMode === 'grid' ? 'bg-violet-100 text-violet-700' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-violet-100 text-violet-700' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  title="List view"
                >
                  ≡
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No prompts found</h3>
              <p className="text-gray-500 text-sm mb-6">
                {prompts.length === 0
                  ? "You haven't saved any prompts yet."
                  : "Try adjusting your search or filters."}
              </p>
              {prompts.length === 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  Add your first prompt
                </button>
              )}
            </div>
          )}

          {/* Prompts grid / list */}
          {filtered.length > 0 && (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                  : 'flex flex-col gap-2'
              }
            >
              {filtered.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deletePrompt}
                  onEdit={handleEdit}
                  onUse={incrementUseCount}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PromptModal
          prompt={editingPrompt}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
