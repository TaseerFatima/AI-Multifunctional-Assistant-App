import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface KnowledgeItem {
  id: string;
  title: string;
  text: string;
  type: "code" | "pdf" | "email" | "language" | "general" | "image";
  timestamp: string;
  tags?: string[];
}


interface RAGContextType {
  knowledgeBase: KnowledgeItem[];
  addToKnowledgeBase: (data: Omit<KnowledgeItem, 'id'>) => void;
  searchKnowledgeBase: (query: string) => KnowledgeItem[];
  clearKnowledgeBase: () => void;
  deleteFromKnowledgeBase: (id: string) => void;
}

const RAGContext = createContext<RAGContextType | null>(null);

// Sample initial knowledge
const initialKnowledge: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Professional Email Guidelines',
    text: 'Professional emails should include: Clear subject line, Proper salutation, Concise body, Professional closing, Contact information.',
    type: 'email',
    tags: ['email', 'professional', 'guidelines'],
    timestamp: new Date().toLocaleString()
  },
  {
    id: '2',
    title: 'PDF Summary Best Practices',
    text: 'Effective summaries should: Capture main ideas, Use bullet points for clarity, Highlight key statistics, Maintain original meaning, Be concise.',
    type: 'pdf',
    tags: ['pdf', 'summarization', 'best-practices'],
    timestamp: new Date().toLocaleString()
  }
];

export const RAGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(() => {
    const saved = localStorage.getItem('rag-knowledge-base');
    return saved ? JSON.parse(saved) : initialKnowledge;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('rag-knowledge-base', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  const addToKnowledgeBase = useCallback((data: Omit<KnowledgeItem, 'id'>) => {
    const newItem: KnowledgeItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    setKnowledgeBase(prev => [...prev, newItem]);
  }, []);

const searchKnowledgeBase = useCallback((query: string) => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return knowledgeBase.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.text.toLowerCase().includes(lowerQuery) ||
    (item.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    item.type.toLowerCase().includes(lowerQuery)
  );
}, [knowledgeBase]);


  const clearKnowledgeBase = useCallback(() => {
    setKnowledgeBase([]);
  }, []);

  const deleteFromKnowledgeBase = useCallback((id: string) => {
    setKnowledgeBase(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <RAGContext.Provider value={{
      knowledgeBase,
      addToKnowledgeBase,
      searchKnowledgeBase,
      clearKnowledgeBase,
      deleteFromKnowledgeBase
    }}>
      {children}
    </RAGContext.Provider>
  );
};

export const useRAG = () => {
  const context = useContext(RAGContext);
  if (!context) {
    throw new Error('useRAG must be used within RAGProvider');
  }
  return context;
};