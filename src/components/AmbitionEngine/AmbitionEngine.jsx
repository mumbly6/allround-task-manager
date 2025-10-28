import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../../context/AIContext';
import { fadeIn, staggerContainer } from '../../utils/animations';
import { CheckCircleIcon, LightBulbIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const AmbitionEngine = () => {
  const [goal, setGoal] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown');
  const { generateTask } = useAI();

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    try {
      // In a real app, this would call your AI service to generate milestones
      const generatedMilestones = await generateMilestones(goal);
      setMilestones(generatedMilestones);
    } catch (error) {
      console.error('Error generating milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI generating milestones (replace with actual AI call)
  const generateMilestones = async (goal) => {
    // This is a mock implementation
    return [
      {
        id: 1,
        title: `Research ${goal} fundamentals`,
        description: 'Gather basic information and resources',
        completed: false,
        tasks: [
          { id: 1, title: 'Find 3 introductory articles', completed: false },
          { id: 2, title: 'Watch tutorial videos', completed: false },
        ],
      },
      {
        id: 2,
        title: 'Create learning plan',
        description: 'Break down the goal into manageable parts',
        completed: false,
        tasks: [],
      },
      {
        id: 3,
        title: 'Start practical application',
        description: 'Begin working on small projects',
        completed: false,
        tasks: [],
      },
    ];
  };

  const toggleTaskComplete = (milestoneId, taskId) => {
    setMilestones(prev => 
      prev.map(milestone => 
        milestone.id === milestoneId
          ? {
              ...milestone,
              tasks: milestone.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : milestone
      )
    );
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeIn('up', 0.1)}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ambition Engine</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Break down your big dreams into achievable milestones
        </p>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        variants={fadeIn('up', 0.2)}
      >
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What's your big goal or dream?
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="e.g., Learn web development, Start a business, Write a book..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!goal.trim() || isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Planning...
                  </>
                ) : (
                  'Plan My Journey'
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {milestones.length > 0 && (
        <motion.div 
          variants={fadeIn('up', 0.3)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'breakdown'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Milestone Breakdown
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'progress'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Progress Tracker
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'resources'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Recommended Resources
              </button>
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'breakdown' && (
                <motion.div
                  key="breakdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Your Personalized Roadmap
                  </h3>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <span className="text-primary-600 dark:text-primary-400 font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                {milestone.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        {milestone.tasks && milestone.tasks.length > 0 && (
                          <div className="p-4 bg-white dark:bg-gray-800">
                            <ul className="space-y-2">
                              {milestone.tasks.map((task) => (
                                <li key={task.id} className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id={`task-${milestone.id}-${task.id}`}
                                      name={`task-${milestone.id}-${task.id}`}
                                      type="checkbox"
                                      checked={task.completed}
                                      onChange={() => toggleTaskComplete(milestone.id, task.id)}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label
                                      htmlFor={`task-${milestone.id}-${task.id}`}
                                      className={`font-medium ${
                                        task.completed
                                          ? 'text-gray-500 dark:text-gray-400 line-through'
                                          : 'text-gray-700 dark:text-gray-300'
                                      }`}
                                    >
                                      {task.title}
                                    </label>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'progress' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Your Progress
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary-600 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{
                          width: `${(milestones.filter(m => m.completed).length / milestones.length) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                      {milestones.filter(m => m.completed).length} of {milestones.length} milestones completed
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Next Steps</h4>
                    <div className="space-y-3">
                      {milestones
                        .filter(milestone => !milestone.completed)
                        .slice(0, 3)
                        .map(milestone => (
                          <div key={milestone.id} className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="h-5 w-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary-500" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {milestone.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Recommended Resources
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Curated learning materials to help you achieve your goal
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        id: 1,
                        title: 'Getting Started Guide',
                        type: 'Article',
                        description: 'Comprehensive guide for beginners',
                        url: '#',
                        icon: '📚',
                      },
                      {
                        id: 2,
                        title: 'Video Tutorials',
                        type: 'Playlist',
                        description: 'Step-by-step video tutorials',
                        url: '#',
                        icon: '🎥',
                      },
                      {
                        id: 3,
                        title: 'Community Forum',
                        type: 'Community',
                        description: 'Connect with others on the same journey',
                        url: '#',
                        icon: '👥',
                      },
                      {
                        id: 4,
                        title: 'Recommended Tools',
                        type: 'Tools',
                        description: 'Essential tools to get started',
                        url: '#',
                        icon: '🛠️',
                      },
                    ].map((resource) => (
                      <motion.div
                        key={resource.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl">
                            {resource.icon}
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {resource.description}
                            </p>
                            <a
                              href={resource.url}
                              className="mt-1 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              Explore →
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {milestones.length === 0 && (
        <motion.div
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          variants={fadeIn('up', 0.3)}
        >
          <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No goals set yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter a goal above to get started with your personalized plan.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AmbitionEngine;
