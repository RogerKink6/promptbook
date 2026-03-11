'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Prompt, AITool, PromptCategory } from '@/lib/types';
import { getPrompts, savePrompts } from '@/lib/storage';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPrompts(getPrompts());
    setLoading(false);
  }, []);

  const addPrompt = useCallback((data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'useCount'>) => {
    const now = new Date().toISOString();
    const newPrompt: Prompt = {
      ...data,
      id: uuidv4(),
      useCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setPrompts(prev => {
      const updated = [newPrompt, ...prev];
      savePrompts(updated);
      return updated;
    });
    return newPrompt;
  }, []);

  const updatePrompt = useCallback((id: string, data: Partial<Prompt>) => {
    setPrompts(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      );
      savePrompts(updated);
      return updated;
    });
  }, []);

  const deletePrompt = useCallback((id: string) => {
    setPrompts(prev => {
      const updated = prev.filter(p => p.id !== id);
      savePrompts(updated);
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setPrompts(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite, updatedAt: new Date().toISOString() } : p
      );
      savePrompts(updated);
      return updated;
    });
  }, []);

  const incrementUseCount = useCallback((id: string) => {
    setPrompts(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, useCount: p.useCount + 1, updatedAt: new Date().toISOString() } : p
      );
      savePrompts(updated);
      return updated;
    });
  }, []);

  const filterPrompts = useCallback(
    (
      query: string,
      category: PromptCategory | 'All',
      tool: AITool | 'All',
      favoritesOnly: boolean
    ) => {
      return prompts.filter(p => {
        const matchesSearch =
          !query ||
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.content.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
          (p.description?.toLowerCase().includes(query.toLowerCase()) ?? false);
        const matchesCategory = category === 'All' || p.category === category;
        const matchesTool = tool === 'All' || p.tool === tool;
        const matchesFavorite = !favoritesOnly || p.isFavorite;
        return matchesSearch && matchesCategory && matchesTool && matchesFavorite;
      });
    },
    [prompts]
  );

  return {
    prompts,
    loading,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementUseCount,
    filterPrompts,
  };
}
