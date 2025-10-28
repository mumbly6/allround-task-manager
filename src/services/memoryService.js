// Memory Service - Handles long-term memory and context for the AI
import { v4 as uuidv4 } from 'uuid';

class MemoryService {
  constructor() {
    this.memories = new Map();
    this.loadMemories();
  }

  // Load memories from localStorage
  loadMemories() {
    const savedMemories = localStorage.getItem('aiMemory');
    if (savedMemories) {
      try {
        const parsed = JSON.parse(savedMemories);
        this.memories = new Map(parsed);
      } catch (e) {
        console.error('Failed to load memories:', e);
        this.memories = new Map();
      }
    }
  }

  // Save memories to localStorage
  saveMemories() {
    try {
      const serialized = JSON.stringify(Array.from(this.memories.entries()));
      localStorage.setItem('aiMemory', serialized);
    } catch (e) {
      console.error('Failed to save memories:', e);
    }
  }

  // Add a new memory with automatic categorization
  async addMemory(content, metadata = {}) {
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    
    const memory = {
      id,
      content,
      timestamp,
      metadata: {
        type: metadata.type || 'observation',
        priority: metadata.priority || 1,
        tags: metadata.tags || [],
        ...metadata
      },
      // Will be populated by the AI
      analysis: null,
      connections: []
    };

    // Store the memory
    this.memories.set(id, memory);
    
    // Analyze the memory in the background
    this.analyzeMemory(id);
    
    // Save to storage
    this.saveMemories();
    
    return id;
  }

  // Analyze a memory using AI
  async analyzeMemory(memoryId) {
    const memory = this.memories.get(memoryId);
    if (!memory) return;

    try {
      // This would call your AI service to analyze the memory
      // For now, we'll use a simple placeholder
      memory.analysis = {
        sentiment: 'positive',
        keyThemes: ['productivity', 'learning'],
        actionItems: []
      };
      
      // Update the memory
      this.memories.set(memoryId, memory);
      this.saveMemories();
      
      return memory.analysis;
    } catch (error) {
      console.error('Error analyzing memory:', error);
      return null;
    }
  }

  // Find related memories
  findRelatedMemories(query, limit = 5) {
    // In a real implementation, this would use vector similarity search
    // For now, we'll do a simple text search
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const [id, memory] of this.memories) {
      const content = typeof memory.content === 'string' 
        ? memory.content 
        : JSON.stringify(memory.content);
        
      if (content.toLowerCase().includes(queryLower)) {
        results.push({
          id,
          ...memory,
          relevance: 1.0 // Placeholder for actual relevance score
        });
        
        if (results.length >= limit) break;
      }
    }
    
    return results;
  }

  // Get memory by ID
  getMemory(id) {
    return this.memories.get(id);
  }

  // Get all memories, sorted by timestamp
  getAllMemories(limit = 50) {
    return Array.from(this.memories.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // Clear all memories (use with caution!)
  clearMemories() {
    this.memories.clear();
    this.saveMemories();
  }
}

// Export a singleton instance
export const memoryService = new MemoryService();
