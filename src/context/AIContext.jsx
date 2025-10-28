import React, { createContext, useContext, useState, useEffect } from 'react';
import * as aiService from '../services/aiService';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [aiState, setAiState] = useState({
    isInitialized: false,
    isLoading: false,
    error: null,
    suggestions: [],
    insights: {},
    motivationalMessage: '',
  });

  // Load initial AI data
  useEffect(() => {
    const initializeAI = async () => {
      try {
        setAiState(prev => ({ ...prev, isLoading: true }));
        
        // Get initial motivational message
        const message = await aiService.getMotivationalMessage();
        
        setAiState(prev => ({
          ...prev,
          isInitialized: true,
          motivationalMessage: message,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Failed to initialize AI:', error);
        setAiState(prev => ({
          ...prev,
          error: 'Failed to initialize AI features',
          isLoading: false,
        }));
      }
    };

    initializeAI();
  }, []);

  // Update task patterns when tasks change
  const updateTaskPatterns = async (tasks) => {
    try {
      setAiState(prev => ({ ...prev, isLoading: true }));
      const insights = await aiService.analyzeTaskPatterns(tasks);
      
      setAiState(prev => ({
        ...prev,
        insights: {
          ...prev.insights,
          ...insights,
          lastUpdated: new Date().toISOString(),
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating task patterns:', error);
      setAiState(prev => ({
        ...prev,
        error: 'Failed to update task patterns',
        isLoading: false,
      }));
    }
  };

  // Get personalized suggestions
  const getSuggestions = async () => {
    try {
      setAiState(prev => ({ ...prev, isLoading: true }));
      const context = aiService.getContext();
      const suggestions = await aiService.getPersonalizedSuggestions(context);
      
      setAiState(prev => ({
        ...prev,
        suggestions: Array.isArray(suggestions) ? suggestions : [suggestions],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setAiState(prev => ({
        ...prev,
        error: 'Failed to get suggestions',
        isLoading: false,
      }));
    }
  };

  // Process user feedback
  const processFeedback = async (feedback) => {
    try {
      setAiState(prev => ({ ...prev, isLoading: true }));
      const response = await aiService.processUserFeedback(feedback);
      
      // Update suggestions based on feedback
      await getSuggestions();
      
      return response;
    } catch (error) {
      console.error('Error processing feedback:', error);
      throw error;
    } finally {
      setAiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Generate a new task from description
  const generateTask = async (description) => {
    try {
      setAiState(prev => ({ ...prev, isLoading: true }));
      const task = await aiService.generateTaskFromDescription(description);
      return task;
    } catch (error) {
      console.error('Error generating task:', error);
      throw error;
    } finally {
      setAiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Refresh motivational message
  const refreshMotivationalMessage = async () => {
    try {
      const message = await aiService.getMotivationalMessage();
      setAiState(prev => ({
        ...prev,
        motivationalMessage: message,
      }));
    } catch (error) {
      console.error('Error refreshing motivational message:', error);
    }
  };

  return (
    <AIContext.Provider
      value={{
        ...aiState,
        updateTaskPatterns,
        getSuggestions,
        processFeedback,
        generateTask,
        refreshMotivationalMessage,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
