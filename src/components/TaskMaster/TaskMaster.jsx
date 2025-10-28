import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fadeIn, 
  staggerContainer, 
  slideIn,
  zoomIn
} from '../../utils/animations';
import { 
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  TagIcon,
  CalendarIcon,
  BellIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
  LightBulbIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  DocumentTextIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

// Mock data
const initialTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft and finalize the project proposal document',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'high',
    status: 'in-progress',
    category: 'work',
    tags: ['important', 'deadline'],
    timeSpent: 0, // in seconds
    estimatedTime: 120, // in minutes
    subtasks: [
      { id: '1-1', title: 'Research competitors', completed: true },
      { id: '1-2', title: 'Draft outline', completed: true },
      { id: '1-3', title: 'Write content', completed: false },
      { id: '1-4', title: 'Review and edit', completed: false },
    ],
    notes: 'Need to include budget section',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // More tasks...
];

const categories = [
  { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-800' },
  { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-800' },
  { id: 'health', name: 'Health', color: 'bg-red-100 text-red-800' },
  { id: 'learning', name: 'Learning', color: 'bg-purple-100 text-purple-800' },
  { id: 'finance', name: 'Finance', color: 'bg-yellow-100 text-yellow-800' },
];

const priorities = [
  { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800' },
];

const statuses = [
  { id: 'not-started', name: 'Not Started' },
  { id: 'in-progress', name: 'In Progress' },
  { id: 'on-hold', name: 'On Hold' },
  { id: 'completed', name: 'Completed' },
];

const TaskMaster = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [timer, setTimer] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const motivationQuotes = [
    "The secret of getting ahead is getting started.",
    "You don't have to be great to start, but you have to start to be great.",
    "The future depends on what you do today.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The only limit to our realization of tomorrow is our doubts of today.",
  ];

  // Task CRUD Operations
  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
    setShowTaskForm(false);
    showRandomMotivation();
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : task));
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'in-progress' : 'completed' }
        : task
    ));
  };

  // Timer Functions
  const startTimer = (taskId) => {
    if (timer) clearInterval(timer);
    setActiveTaskId(taskId);
    setTimeSpent(0);
    
    const newTimer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        // Update the task's time spent every 60 seconds (1 minute)
        if (newTime % 60 === 0) {
          updateTaskTimeSpent(taskId, newTime / 60);
        }
        return newTime;
      });
    }, 1000);
    
    setTimer(newTimer);
    showRandomMotivation();
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
      updateTaskTimeSpent(activeTaskId, Math.ceil(timeSpent / 60));
      setActiveTaskId(null);
      setTimeSpent(0);
    }
  };

  const updateTaskTimeSpent = (taskId, minutesToAdd) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, timeSpent: (task.timeSpent || 0) + minutesToAdd }
        : task
    ));
  };

  // Motivation
  const showRandomMotivation = () => {
    if (Math.random() > 0.7) { // 30% chance to show motivation
      const randomQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
      setMotivation(randomQuote);
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 5000);
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'today' && new Date(task.dueDate).toDateString() === new Date().toDateString()) ||
                         task.status === filter ||
                         task.priority === filter ||
                         task.category === filter;
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Analytics
  const taskAnalytics = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    byCategory: categories.map(cat => ({
      ...cat,
      count: tasks.filter(t => t.category === cat.id).length
    })),
    byPriority: priorities.map(p => ({
      ...p,
      count: tasks.filter(t => t.priority === p.id).length
    }))
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  // Format time (seconds to HH:MM:SS)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        variants={fadeIn('up', 0.1)}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Master</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your tasks, track time, and boost productivity
          </p>
        </div>
        
        <div className="flex items-center space-x-3
        ">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <button
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Task
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        className="border-b border-gray-200 dark:border-gray-700"
        variants={fadeIn('up', 0.2)}
      >
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <DocumentTextIcon className="w-5 h-5 inline-block mr-2" />
            My Tasks
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <CalendarIcon className="w-5 h-5 inline-block mr-2" />
            Calendar
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics');
              setShowAnalytics(true);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <ChartBarIcon className="w-5 h-5 inline-block mr-2" />
            Analytics
          </button>
        </nav>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex flex-wrap items-center gap-2"
        variants={fadeIn('up', 0.3)}
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            filter === 'all'
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
            filter === 'today'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <ClockIcon className="w-3.5 h-3.5 mr-1" />
          Today
        </button>
        {priorities.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilter(p.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
              filter === p.id
                ? `${p.color} dark:opacity-90`
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FlagIcon className="w-3.5 h-3.5 mr-1" />
            {p.name}
          </button>
        ))}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
              filter === cat.id
                ? `${cat.color} dark:opacity-90`
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <TagIcon className="w-3.5 h-3.5 mr-1" />
            {cat.name}
          </button>
        ))}
      </motion.div>

      {/* Task List */}
      {activeTab === 'list' && (
        <motion.div 
          className="space-y-4"
          variants={fadeIn('up', 0.4)}
        >
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <DocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'No tasks match your search. Try adjusting your filters.'
                  : 'Get started by creating a new task.'}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  New Task
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg border-l-4 ${
                    task.priority === 'high' 
                      ? 'border-red-500' 
                      : task.priority === 'medium' 
                        ? 'border-yellow-500' 
                        : 'border-green-500'
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                              task.status === 'completed'
                                ? 'bg-green-100 border-green-500 text-green-600 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
                                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-400'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <CheckIcon className="h-3 w-3" />
                            )}
                          </button>
                          <h3 className={`text-lg font-medium ${
                            task.status === 'completed' 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                        
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              categories.find(c => c.id === task.category)?.color || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {categories.find(c => c.id === task.category)?.name || 'Uncategorized'}
                          </span>
                          
                          {task.tags?.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                          
                          {task.dueDate && (
                            <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <ClockIcon className="h-3.5 w-3.5 mr-1" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          
                          {task.estimatedTime && (
                            <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <ClockIcon className="h-3.5 w-3.5 mr-1" />
                              {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
                            </span>
                          )}
                          
                          {task.timeSpent > 0 && (
                            <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
                              {Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m spent
                            </span>
                          )}
                        </div>
                        
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
                            </h4>
                            <div className="space-y-1">
                              {task.subtasks.map((subtask) => (
                                <div key={subtask.id} className="flex items-center">
                                  <input
                                    id={`subtask-${subtask.id}`}
                                    name={`subtask-${subtask.id}`}
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => {
                                      // In a real app, you'd update the subtask status in the parent task
                                      console.log(`Toggle subtask ${subtask.id}`);
                                    }}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor={`subtask-${subtask.id}`}
                                    className={`ml-2 text-sm ${
                                      subtask.completed 
                                        ? 'line-through text-gray-400 dark:text-gray-500' 
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                  >
                                    {subtask.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-shrink-0 flex space-x 2">
                        {activeTaskId === task.id ? (
                          <button
                            onClick={stopTimer}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <StopIcon className="h-4 w-4 mr-1" />
                            Stop
                          </button>
                        ) : (
                          <button
                            onClick={() => startTimer(task.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <PlayIcon className="h-4 w-4 mr-1" />
                            Start
                          </button>
                        )}
                        
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            className="inline-flex justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primary-500"
                            id="options-menu"
                            aria-expanded="true"
                            aria-haspopup="true"
                            onClick={() => {
                              // Toggle dropdown
                              console.log('Toggle dropdown');
                            }}
                          >
                            <span className="sr-only">Open options</span>
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          
                          {/* Dropdown menu */}
                          <div
                            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div className="py-1" role="none">
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setShowTaskForm(true);
                                }}
                                className="text-gray-700 dark:text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                              >
                                <PencilIcon className="h-4 w-4 inline-block mr-2" />
                                Edit Task
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this task?')) {
                                    deleteTask(task.id);
                                  }
                                }}
                                className="text-red-600 dark:text-red-400 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                              >
                                <TrashIcon className="h-4 w-4 inline-block mr-2" />
                                Delete Task
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Timer Display */}
      {activeTaskId && (
        <motion.div 
          className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Currently Tracking</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {tasks.find(t => t.id === activeTaskId)?.title}
              </p>
            </div>
            <button
              onClick={stopTimer}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-3xl font-bold text-center text-primary-600 dark:text-primary-400">
            {formatTime(timeSpent)}
          </div>
          <div className="mt-3 flex justify-center">
            <button
              onClick={stopTimer}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <StopIcon className="h-4 w-4 mr-2" />
              Stop Timer
            </button>
          </div>
        </motion.div>
      )}

      {/* Motivation Popup */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-md w-full z-50"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <SparklesIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Keep it up! 💪
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {motivation}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setShowMotivation(false)}
                  className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics View */}
      {activeTab === 'analytics' && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Tasks
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {taskAnalytics.total}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Completed
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {taskAnalytics.completed}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                          {taskAnalytics.total > 0 
                            ? Math.round((taskAnalytics.completed / taskAnalytics.total) * 100) 
                            : 0}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <ArrowPathIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        In Progress
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {taskAnalytics.inProgress}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Tasks by Category
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Distribution of tasks across different categories
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {taskAnalytics.byCategory
                    .filter(cat => cat.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .map((category) => {
                      const percentage = (category.count / taskAnalytics.total) * 100;
                      return (
                        <div key={category.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {category.count} tasks
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div 
                              className="h-2.5 rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: category.color.split(' ')[0].replace('bg-', '')
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Tasks by Priority
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Distribution of tasks by priority level
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {taskAnalytics.byPriority
                    .filter(p => p.count > 0)
                    .sort((a, b) => {
                      const order = { high: 0, medium: 1, low: 2 };
                      return order[a.id] - order[b.id];
                    })
                    .map((priority) => {
                      const percentage = (priority.count / taskAnalytics.total) * 100;
                      return (
                        <div key={priority.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {priority.name}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {priority.count} tasks
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div 
                              className="h-2.5 rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: priority.color.split(' ')[0].replace('bg-', '')
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Productivity Trends
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Your task completion rate over time
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Productivity chart will be displayed here
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <motion.div 
          className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Task Calendar
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              View and manage your tasks on a calendar
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Interactive calendar will be displayed here
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowTaskForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const taskData = {
                      title: formData.get('title'),
                      description: formData.get('description'),
                      dueDate: formData.get('dueDate'),
                      priority: formData.get('priority'),
                      category: formData.get('category'),
                      status: formData.get('status'),
                      tags: formData.get('tags')?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
                      estimatedTime: parseInt(formData.get('estimatedTime') || '0'),
                      subtasks: editingTask?.subtasks || [],
                      notes: formData.get('notes'),
                    };

                    if (editingTask) {
                      updateTask({ ...editingTask, ...taskData });
                    } else {
                      addTask({
                        ...taskData,
                        id: Date.now().toString(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        timeSpent: 0,
                      });
                    }
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      defaultValue={editingTask?.title || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="What needs to be done?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      defaultValue={editingTask?.description || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Add details about this task..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        defaultValue={editingTask?.dueDate || ''}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        defaultValue={editingTask?.priority || 'medium'}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        defaultValue={editingTask?.category || 'work'}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        defaultValue={editingTask?.status || 'not-started'}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      >
                        {statuses.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="estimatedTime"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Estimated Time (minutes)
                      </label>
                      <input
                        type="number"
                        name="estimatedTime"
                        id="estimatedTime"
                        min="0"
                        step="5"
                        defaultValue={editingTask?.estimatedTime || '30'}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        id="tags"
                        defaultValue={editingTask?.tags?.join(', ') || ''}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        placeholder="work, important, project-x"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Separate tags with commas
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={3}
                      defaultValue={editingTask?.notes || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Add any additional notes..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTaskForm(false);
                        setEditingTask(null);
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskMaster;
