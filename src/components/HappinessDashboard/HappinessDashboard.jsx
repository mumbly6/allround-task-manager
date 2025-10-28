import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../utils/animations';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  HeartIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

// Import the feature hub components
import LearningHub from '../LearningHub/LearningHub';
import CommunityHub from '../CommunityHub/CommunityHub';
import WellbeingHub from '../WellbeingHub/WellbeingHub';

const HappinessDashboard = () => {
  const [activeTab, setActiveTab] = useState('wellbeing');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabs = [
    { id: 'wellbeing', name: 'Wellbeing', icon: HeartIcon },
    { id: 'learning', name: 'Learning', icon: BookOpenIcon },
    { id: 'community', name: 'Community', icon: UserGroupIcon },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'learning':
        return <LearningHub />;
      case 'community':
        return <CommunityHub />;
      case 'wellbeing':
      default:
        return <WellbeingHub />;
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div 
        className="border-b border-gray-200 dark:border-gray-700 pb-4"
        variants={fadeIn('up', 0.1)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Happiness Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your personal hub for wellbeing, learning, and community
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            title="Refresh data"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        className="flex-1 overflow-auto p-4"
        variants={fadeIn('up', 0.2)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default HappinessDashboard;
