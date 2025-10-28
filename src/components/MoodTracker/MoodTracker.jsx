import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../utils/animations';
import { FaceSmileIcon, FaceFrownIcon, BoltIcon, MoonIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const moodOptions = [
  { id: 'excited', label: 'Excited', icon: '😊', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'happy', label: 'Happy', icon: '😊', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'neutral', label: 'Neutral', icon: '😐', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'tired', label: 'Tired', icon: '😴', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'stressed', label: 'Stressed', icon: '😫', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
];

const energyLevels = [
  { id: 'high', label: 'High', icon: <BoltIcon className="h-5 w-5" />, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'medium', label: 'Medium', icon: <BoltIcon className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'low', label: 'Low', icon: <MoonIcon className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
];

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(null);
  const [currentEnergy, setCurrentEnergy] = useState(null);
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load mood history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save mood history to localStorage when it changes
  useEffect(() => {
    if (moodHistory.length > 0) {
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
  };

  const handleEnergySelect = (energy) => {
    setCurrentEnergy(energy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentMood || !currentEnergy) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        mood: currentMood,
        energy: currentEnergy,
        note: note.trim(),
        timestamp: new Date().toISOString(),
      };
      
      setMoodHistory(prev => [newEntry, ...prev]);
      setCurrentMood(null);
      setCurrentEnergy(null);
      setNote('');
      setIsSubmitting(false);
      
      // Show success message
      alert('Mood recorded successfully!');
    }, 1000);
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null;
    
    const moodCounts = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood.id] = (moodCounts[entry.mood.id] || 0) + 1;
    });
    
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    );
    
    const moodData = moodOptions.map(mood => ({
      ...mood,
      count: moodCounts[mood.id] || 0,
      percentage: Math.round(((moodCounts[mood.id] || 0) / moodHistory.length) * 100),
    }));
    
    return {
      totalEntries: moodHistory.length,
      mostCommonMood: moodOptions.find(m => m.id === mostCommonMood[0]),
      moodData,
    };
  };

  const stats = getMoodStats();

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeIn('up', 0.1)}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mood & Energy Tracker</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track your emotional state and energy levels to optimize your productivity
        </p>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6"
        variants={fadeIn('up', 0.2)}
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">How are you feeling right now?</h3>
          <div className="flex flex-wrap gap-3">
            {moodOptions.map((mood) => (
              <motion.button
                key={mood.id}
                type="button"
                className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
                  currentMood?.id === mood.id
                    ? `${mood.color} ring-2 ring-offset-2 ring-primary-500`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleMoodSelect(mood)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">{mood.icon}</span>
                <span>{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">What's your energy level?</h3>
          <div className="flex flex-wrap gap-3">
            {energyLevels.map((energy) => (
              <motion.button
                key={energy.id}
                type="button"
                className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
                  currentEnergy?.id === energy.id
                    ? `${energy.color} ring-2 ring-offset-2 ring-primary-500`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleEnergySelect(energy)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {energy.icon}
                <span>{energy.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Add a note (optional)
          </label>
          <div className="mt-1">
            <textarea
              rows={3}
              name="note"
              id="note"
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="What's on your mind? What's affecting your mood or energy?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!currentMood || !currentEnergy || isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              !currentMood || !currentEnergy || isSubmitting
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
            whileHover={currentMood && currentEnergy && !isSubmitting ? { scale: 1.03 } : {}}
            whileTap={currentMood && currentEnergy && !isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Entry'
            )}
          </motion.button>
        </div>
      </motion.div>

      {moodHistory.length > 0 && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          variants={fadeIn('up', 0.3)}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Mood History</h3>
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>

            {stats && (
              <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Entries
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                      {stats.totalEntries}
                    </dd>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Most Common Mood
                    </dt>
                    <dd className="mt-1 flex items-center">
                      <span className="text-2xl mr-2">{stats.mostCommonMood.icon}</span>
                      <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.mostCommonMood.label}
                      </span>
                    </dd>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Mood Distribution
                    </dt>
                    <dd className="mt-1">
                      <div className="flex space-x-1">
                        {stats.moodData.map((mood) => (
                          <div 
                            key={mood.id}
                            className={`h-2 rounded-full ${mood.color.split(' ')[0]}`}
                            style={{ width: `${mood.percentage}%` }}
                            title={`${mood.label}: ${mood.percentage}%`}
                          />
                        ))}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flow-root mt-6">
                    <ul className="-mb-8 divide-y divide-gray-200 dark:divide-gray-700">
                      {moodHistory.slice(0, 7).map((entry, entryIdx) => {
                        const mood = moodOptions.find(m => m.id === entry.mood.id) || {};
                        const energy = energyLevels.find(e => e.id === entry.energy.id) || {};
                        const date = new Date(entry.timestamp);
                        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        return (
                          <motion.li 
                            key={entry.id}
                            className="relative pb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: entryIdx * 0.05 }}
                          >
                            {entryIdx !== moodHistory.length - 1 && (
                              <span 
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" 
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${mood.color}`}>
                                  <span className="text-lg">{mood.icon}</span>
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Felt <span className="font-medium text-gray-900 dark:text-white">{mood.label.toLowerCase()}</span> with <span className="font-medium text-gray-900 dark:text-white">{energy.label.toLowerCase()}</span> energy
                                  </p>
                                  {entry.note && (
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 italic">"{entry.note}"</p>
                                  )}
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                  <time dateTime={entry.timestamp}>
                                    {new Date(entry.timestamp).toLocaleDateString()}
                                  </time>
                                  <div className="text-xs">{timeString}</div>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MoodTracker;
