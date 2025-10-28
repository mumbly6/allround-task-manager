import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fadeIn, 
  staggerContainer, 
  slideIn 
} from '../../utils/animations';
import { 
  HeartIcon,
  MoonIcon,
  SunIcon,
  ClockIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

// Mock data - in a real app, this would come from an API
const initialMoods = [
  { id: 1, name: 'Happy', emoji: '😊', color: 'bg-yellow-100 text-yellow-800', selected: false },
  { id: 2, name: 'Calm', emoji: '😌', color: 'bg-blue-100 text-blue-800', selected: false },
  { id: 3, name: 'Energetic', emoji: '⚡', color: 'bg-green-100 text-green-800', selected: false },
  { id: 4, name: 'Tired', emoji: '😴', color: 'bg-indigo-100 text-indigo-800', selected: false },
  { id: 5, name: 'Stressed', emoji: '😫', color: 'bg-red-100 text-red-800', selected: false },
  { id: 6, name: 'Focused', emoji: '🎯', color: 'bg-purple-100 text-purple-800', selected: false },
];

const meditationSessions = [
  { id: 1, title: 'Morning Calm', duration: 5, category: 'Focus', completed: false },
  { id: 2, title: 'Stress Relief', duration: 10, category: 'Anxiety', completed: true },
  { id: 3, title: 'Deep Sleep', duration: 15, category: 'Sleep', completed: false },
  { id: 4, title: 'Quick Break', duration: 3, category: 'Focus', completed: false },
  { id: 5, title: 'Anxiety Relief', duration: 12, category: 'Anxiety', completed: false },
  { id: 6, title: 'Body Scan', duration: 20, category: 'Sleep', completed: true },
];

const sleepSounds = [
  { id: 1, name: 'Rain', icon: '🌧️', duration: '60:00', playing: false },
  { id: 2, name: 'Ocean Waves', icon: '🌊', duration: '45:00', playing: false },
  { id: 3, name: 'Forest', icon: '🌲', duration: '30:00', playing: false },
  { id: 4, name: 'White Noise', icon: '📻', duration: '90:00', playing: false },
  { id: 5, name: 'Thunderstorm', icon: '⚡', duration: '60:00', playing: false },
  { id: 6, name: 'Fireplace', icon: '🔥', duration: '45:00', playing: false },
];

const breathingExercises = [
  { 
    id: 1, 
    name: '4-7-8 Breathing', 
    description: 'Inhale for 4s, hold for 7s, exhale for 8s',
    pattern: [4, 7, 8],
    duration: 2, // minutes
    completed: false 
  },
  { 
    id: 2, 
    name: 'Box Breathing', 
    description: 'Inhale, hold, exhale, and hold for equal counts',
    pattern: [4, 4, 4, 4],
    duration: 3, // minutes
    completed: true 
  },
  { 
    id: 3, 
    name: 'Deep Breathing', 
    description: 'Slow, deep breaths to relax',
    pattern: [5, 0, 5],
    duration: 2, // minutes
    completed: false 
  },
];

const WellbeingHub = () => {
  const [activeTab, setActiveTab] = useState('mood');
  const [moods, setMoods] = useState(initialMoods);
  const [currentMood, setCurrentMood] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showMeditationPlayer, setShowMeditationPlayer] = useState(false);
  const [currentMeditation, setCurrentMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [currentBreathingExercise, setCurrentBreathingExercise] = useState(null);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale, rest
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(0);
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [breathingTimer, setBreathingTimer] = useState(null);
  const [sleepTimer, setSleepTimer] = useState(30); // in minutes
  const [activeSound, setActiveSound] = useState(null);
  
  // Track mood
  const handleMoodSelect = (mood) => {
    const updatedMoods = moods.map(m => ({
      ...m,
      selected: m.id === mood.id
    }));
    setMoods(updatedMoods);
    setCurrentMood(mood);
    
    // In a real app, save this to the database
    setTimeout(() => {
      setShowMoodModal(false);
    }, 1000);
  };

  // Start meditation session
  const startMeditation = (meditation) => {
    setCurrentMeditation(meditation);
    setShowMeditationPlayer(true);
    setIsPlaying(true);
  };

  // Toggle play/pause for meditation
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute for sounds
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Start breathing exercise
  const startBreathingExercise = (exercise) => {
    setCurrentBreathingExercise(exercise);
    setShowBreathingExercise(true);
    startBreathingCycle(exercise);
  };

  // Start breathing cycle
  const startBreathingCycle = (exercise) => {
    // Start with inhale
    setBreathingPhase('inhale');
    setBreathingTimeLeft(exercise.pattern[0]);
    
    // Set up the breathing timer
    const timer = setInterval(() => {
      setBreathingTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Move to next phase
          if (breathingPhase === 'inhale') {
            if (exercise.pattern[1] > 0) {
              setBreathingPhase('hold');
              return exercise.pattern[1];
            } else {
              setBreathingPhase('exhale');
              return exercise.pattern[2] || 0;
            }
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale');
            return exercise.pattern[2] || 0;
          } else if (breathingPhase === 'exhale') {
            if (exercise.pattern[3] > 0) {
              setBreathingPhase('rest');
              return exercise.pattern[3];
            } else {
              // Start next cycle
              setBreathingCycle(prev => prev + 1);
              setBreathingPhase('inhale');
              return exercise.pattern[0];
            }
          } else {
            // Rest phase complete, start next cycle
            setBreathingCycle(prev => prev + 1);
            setBreathingPhase('inhale');
            return exercise.pattern[0];
          }
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setBreathingTimer(timer);
  };

  // Stop breathing exercise
  const stopBreathingExercise = () => {
    if (breathingTimer) {
      clearInterval(breathingTimer);
      setBreathingTimer(null);
    }
    setShowBreathingExercise(false);
    setCurrentBreathingExercise(null);
    setBreathingPhase('inhale');
    setBreathingTimeLeft(0);
    setBreathingCycle(0);
  };

  // Toggle sleep sound
  const toggleSleepSound = (sound) => {
    if (activeSound && activeSound.id === sound.id) {
      setActiveSound(null);
    } else {
      setActiveSound(sound);
    }
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (breathingTimer) {
        clearInterval(breathingTimer);
      }
    };
  }, [breathingTimer]);

  // Get breathing exercise instructions
  const getBreathingInstructions = () => {
    if (!currentBreathingExercise) return '';
    
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
      default:
        return 'Breathe';
    }
  };

  // Get breathing animation class
  const getBreathingAnimationClass = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-110 bg-blue-400';
      case 'hold':
        return 'scale-100 bg-blue-500';
      case 'exhale':
        return 'scale-90 bg-blue-300';
      case 'rest':
        return 'scale-100 bg-blue-200';
      default:
        return 'scale-100 bg-blue-400';
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeIn('up', 0.1)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wellbeing Hub</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Nurture your mind and body with these wellbeing tools
            </p>
          </div>
          <button
            onClick={() => setShowMoodModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <HeartIcon className="-ml-1 mr-2 h-5 w-5" />
            Log Mood
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeIn('up', 0.2)} className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('mood')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'mood'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Mood Tracker
          </button>
          <button
            onClick={() => setActiveTab('meditation')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'meditation'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Meditation
          </button>
          <button
            onClick={() => setActiveTab('breathing')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'breathing'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Breathing Exercises
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'sleep'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Sleep Sounds
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Wellbeing Stats
          </button>
        </nav>
      </motion.div>

      {/* Tab Content */}
      <div className="py-4">
        {/* Mood Tracker */}
        {activeTab === 'mood' && (
          <motion.div 
            variants={fadeIn('up', 0.3)}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mood Tracker</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track your mood and emotional well-being over time
                </p>
              </div>
              <div className="px-6 py-5">
                {currentMood ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full text-4xl mb-4 bg-opacity-20 ${currentMood.color.split(' ')[0]}">
                      {currentMood.emoji}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">You're feeling {currentMood.name.toLowerCase()}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Last updated: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowMoodModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        Update Mood
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No mood recorded today</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Log your current mood to track your emotional well-being
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowMoodModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Log Mood
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mood History - Placeholder for chart */}
              <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Mood History</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mood chart will be displayed here</p>
                </div>
              </div>
            </div>
            
            {/* Mood Tips */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Wellbeing Tips</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Personalized recommendations based on your mood
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 p-2 rounded-md">
                        <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Gratitude Journal</h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Write down 3 things you're grateful for today</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 p-2 rounded-md">
                        <MusicalNoteIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Music Break</h4>
                        <p className="text-xs text-green-600 dark:text-green-400">Listen to an uplifting playlist</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800 p-2 rounded-md">
                        <TrophyIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">Achievement</h4>
                        <p className="text-xs text-purple-600 dark:text-purple-400">Celebrate your progress this week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Meditation */}
        {activeTab === 'meditation' && (
          <motion.div 
            variants={fadeIn('up', 0.3)}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Guided Meditations</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Find peace and clarity with these guided sessions
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {meditationSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => startMeditation(session)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{session.title}</h4>
                        {session.completed && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span>{session.duration} min • {session.category}</span>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Play
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Meditation Stats</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track your meditation journey
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-md p-3">
                          <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Total Time
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                12h 45m
                              </div>
                              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                                <span className="sr-only">Increased by</span>22%
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800 rounded-md p-3">
                          <TrophyIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Current Streak
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                7 days
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-md p-3">
                          <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Sessions
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                24
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Breathing Exercises */}
        {activeTab === 'breathing' && (
          <motion.div 
            variants={fadeIn('up', 0.3)}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Breathing Exercises</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Reduce stress and increase focus with these breathing techniques
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {breathingExercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => startBreathingExercise(exercise)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                        {exercise.completed && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{exercise.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span>{exercise.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">How Breathing Helps</h3>
              </div>
              <div className="p-6">
                <div className="prose prose-pink dark:prose-invert max-w-none">
                  <p>
                    Deep breathing is one of the best ways to lower stress in the body. When you breathe deeply, 
                    it sends a message to your brain to calm down and relax. The brain then sends this message to your body.
                  </p>
                  <p className="mt-3">
                    Benefits of deep breathing include:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• Reduces stress and anxiety</li>
                    <li>• Lowers blood pressure</li>
                    <li>• Improves focus and concentration</li>
                    <li>• Helps with emotional regulation</li>
                    <li>• Promotes better sleep</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Sleep Sounds */}
        {activeTab === 'sleep' && (
          <motion.div 
            variants={fadeIn('up', 0.3)}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sleep Sounds</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Relaxing sounds to help you fall asleep and stay asleep
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sleepSounds.map((sound) => (
                    <div 
                      key={sound.id} 
                      className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors cursor-pointer ${
                        activeSound?.id === sound.id 
                          ? 'ring-2 ring-pink-500' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => toggleSleepSound(sound)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{sound.icon}</div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{sound.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{sound.duration}</p>
                          </div>
                        </div>
                        {activeSound?.id === sound.id ? (
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></div>
                            <span className="text-xs text-pink-600 dark:text-pink-400">Playing</span>
                          </div>
                        ) : (
                          <PlayIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Volume Control */}
                {activeSound && (
                  <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Volume
                      </label>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <SpeakerXMarkIcon className="h-5 w-5" />
                        ) : (
                          <SpeakerWaveIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <input
                      type="range"
                      id="volume"
                      name="volume"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        const newVolume = parseInt(e.target.value);
                        setVolume(newVolume);
                        if (newVolume === 0) {
                          setIsMuted(true);
                        } else if (isMuted) {
                          setIsMuted(false);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Now Playing: {activeSound.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Sleep Timer: {sleepTimer} min
                        </span>
                        <select
                          value={sleepTimer}
                          onChange={(e) => setSleepTimer(parseInt(e.target.value))}
                          className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        >
                          {[5, 10, 15, 30, 45, 60].map((minutes) => (
                            <option key={minutes} value={minutes}>
                              {minutes} min
                            </option>
                          ))}
                          <option value={0}>Off</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sleep Tips</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Improve your sleep quality with these tips
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <MoonIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Stick to a sleep schedule</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Go to bed and wake up at the same time every day, even on weekends.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <SunIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Get some sunlight</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Natural sunlight helps regulate your body's sleep-wake cycle.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <ArrowPathIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Limit daytime naps</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Long naps can interfere with nighttime sleep. Keep naps to 20-30 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Wellbeing Stats */}
        {activeTab === 'stats' && (
          <motion.div 
            variants={fadeIn('up', 0.3)}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Wellbeing Overview</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track your wellbeing journey over time
                </p>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Wellbeing charts will be displayed here</p>
                </div>
                
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-pink-100 dark:bg-pink-900/30 rounded-md p-3">
                          <HeartIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Average Mood
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                7.2
                              </div>
                              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                                <span className="sr-only">Increased by</span>0.8
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-md p-3">
                          <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Sleep Average
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                6h 45m
                              </div>
                              <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600 dark:text-red-400">
                                <span className="sr-only">Decreased by</span>15m
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                          <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Weekly Goal
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                4/7 days
                              </div>
                              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                                <span className="sr-only">On track</span>57%
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Report</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your wellbeing activities this week
                </p>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Weekly activity chart will be displayed here</p>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">This week's highlights:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500">
                        <CheckCircleIcon className="h-5 w-5" />
                      </div>
                      <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        You meditated for <span className="font-medium">28 minutes</span> on Monday - your longest session this week!
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500">
                        <CheckCircleIcon className="h-5 w-5" />
                      </div>
                      <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Your average mood score improved by <span className="font-medium">12%</span> compared to last week.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-yellow-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        You missed your sleep goal by <span className="font-medium">2 days</span> this week. Try to maintain a consistent sleep schedule.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mood Modal */}
      <AnimatePresence>
        {showMoodModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div 
                  className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"
                  onClick={() => setShowMoodModal(false)}
                ></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/30">
                    <HeartIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      How are you feeling today?
                    </h3>
                    <div className="mt-4">
                      <div className="grid grid-cols-3 gap-4">
                        {moods.map((mood) => (
                          <button
                            key={mood.id}
                            type="button"
                            className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                              mood.selected 
                                ? `${mood.color} bg-opacity-20` 
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => handleMoodSelect(mood)}
                          >
                            <span className="text-2xl mb-1">{mood.emoji}</span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">{mood.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:text-sm"
                    onClick={() => setShowMoodModal(false)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Meditation Player */}
      <AnimatePresence>
        {showMeditationPlayer && currentMeditation && (
          <div className="fixed inset-x-0 bottom-0 z-40">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-t-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {currentMeditation.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentMeditation.category} • {currentMeditation.duration} min
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMeditationPlayer(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-48 w-48 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      {isPlaying ? (
                        <button 
                          onClick={togglePlayPause}
                          className="h-16 w-16 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          <PauseIcon className="h-8 w-8" />
                        </button>
                      ) : (
                        <button 
                          onClick={togglePlayPause}
                          className="h-16 w-16 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          <PlayIcon className="h-8 w-8 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>0:00</span>
                      <span>{currentMeditation.duration}:00</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-600 rounded-full" 
                        style={{ width: '30%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" />
                      Restart
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <SpeakerXMarkIcon className="h-5 w-5" />
                        ) : (
                          <SpeakerWaveIcon className="h-5 w-5" />
                        )}
                      </button>
                      
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            const newVolume = parseInt(e.target.value);
                            setVolume(newVolume);
                            if (newVolume === 0) {
                              setIsMuted(true);
                            } else if (isMuted) {
                              setIsMuted(false);
                            }
                          }}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Breathing Exercise Overlay */}
      <AnimatePresence>
        {showBreathingExercise && currentBreathingExercise && (
          <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentBreathingExercise.name}
                  </h2>
                  <button
                    onClick={stopBreathingExercise}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="text-center py-8">
                  <div className={`mx-auto h-64 w-64 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${getBreathingAnimationClass()}`}>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {breathingTimeLeft}
                      </div>
                      <div className="text-lg font-medium text-white">
                        {getBreathingInstructions()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cycle: {breathingCycle + 1} • {currentBreathingExercise.description}
                    </p>
                    
                    <div className="mt-6 flex items-center justify-center space-x-4">
                      <button
                        onClick={stopBreathingExercise}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        End Session
                      </button>
                      
                      {breathingTimer ? (
                        <button
                          onClick={() => {
                            clearInterval(breathingTimer);
                            setBreathingTimer(null);
                          }}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => startBreathingCycle(currentBreathingExercise)}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          Resume
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Breathing Pattern:
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {currentBreathingExercise.pattern[0]}s
                      </span>
                    </div>
                    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Inhale</span>
                  </div>
                  
                  {currentBreathingExercise.pattern[1] > 0 && (
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {currentBreathingExercise.pattern[1]}s
                        </span>
                      </div>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Hold</span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {currentBreathingExercise.pattern[2] || currentBreathingExercise.pattern[1] || 0}s
                      </span>
                    </div>
                    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Exhale</span>
                  </div>
                  
                  {currentBreathingExercise.pattern[3] > 0 && (
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {currentBreathingExercise.pattern[3]}s
                        </span>
                      </div>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Rest</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WellbeingHub;
