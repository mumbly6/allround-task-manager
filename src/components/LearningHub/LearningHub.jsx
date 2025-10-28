import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../utils/animations';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ArrowPathIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

// Mock data - in a real app, this would come from an API
const initialLearningPaths = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Master modern web development with React, Node.js, and more',
    progress: 35,
    category: 'Development',
    level: 'Intermediate',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    resources: [
      { id: 1, type: 'course', title: 'Complete React Guide', duration: '8h 30m', completed: true },
      { id: 2, type: 'article', title: 'Advanced React Patterns', duration: '15m', completed: true },
      { id: 3, type: 'video', title: 'Node.js Crash Course', duration: '2h 15m', completed: false },
    ],
    recommended: true,
  },
  {
    id: 2,
    title: 'Data Science',
    description: 'Learn data analysis and visualization with Python',
    progress: 10,
    category: 'Data',
    level: 'Beginner',
    skills: ['Python', 'Pandas', 'Matplotlib', 'Data Analysis'],
    resources: [
      { id: 4, type: 'course', title: 'Python for Data Science', duration: '6h 45m', completed: false },
    ],
    recommended: false,
  },
  {
    id: 3,
    title: 'UI/UX Design',
    description: 'Master user-centered design principles',
    progress: 0,
    category: 'Design',
    level: 'Beginner',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
    resources: [],
    recommended: true,
  },
];

const resourceTypes = [
  { id: 'all', name: 'All Resources' },
  { id: 'course', name: 'Courses', icon: AcademicCapIcon },
  { id: 'article', name: 'Articles', icon: BookOpenIcon },
  { id: 'video', name: 'Videos', icon: VideoCameraIcon },
  { id: 'podcast', name: 'Podcasts', icon: ChartBarIcon },
];

const skillLevels = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

const LearningHub = () => {
  const [learningPaths, setLearningPaths] = useState(initialLearningPaths);
  const [activeTab, setActiveTab] = useState('my-learning');
  const [selectedPath, setSelectedPath] = useState(null);
  const [resourceFilter, setResourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPathModal, setShowAddPathModal] = useState(false);
  const [newPath, setNewPath] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    skills: '',
  });

  // Filter learning paths based on search and filters
  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || path.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Get recommended learning paths
  const recommendedPaths = learningPaths.filter(path => path.recommended);

  // Handle adding a new learning path
  const handleAddPath = (e) => {
    e.preventDefault();
    const newLearningPath = {
      id: learningPaths.length + 1,
      title: newPath.title,
      description: newPath.description,
      category: newPath.category,
      level: newPath.level,
      skills: newPath.skills.split(',').map(skill => skill.trim()),
      progress: 0,
      resources: [],
      recommended: false,
    };

    setLearningPaths([...learningPaths, newLearningPath]);
    setNewPath({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      skills: '',
    });
    setShowAddPathModal(false);
  };

  // Toggle resource completion
  const toggleResourceComplete = (pathId, resourceId) => {
    setLearningPaths(learningPaths.map(path => {
      if (path.id === pathId) {
        const updatedResources = path.resources.map(resource => 
          resource.id === resourceId 
            ? { ...resource, completed: !resource.completed }
            : resource
        );
        
        // Calculate new progress
        const completedCount = updatedResources.filter(r => r.completed).length;
        const progress = updatedResources.length > 0 
          ? Math.round((completedCount / updatedResources.length) * 100) 
          : 0;
        
        return {
          ...path,
          resources: updatedResources,
          progress,
        };
      }
      return path;
    }));
  };

  // Get resource icon based on type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'course':
        return <AcademicCapIcon className="h-5 w-5 text-blue-500" />;
      case 'article':
        return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      case 'video':
        return <VideoCameraIcon className="h-5 w-5 text-purple-500" />;
      case 'podcast':
        return <ChartBarIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <LightBulbIcon className="h-5 w-5 text-gray-500" />;
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Hub</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Discover and track your learning journey
            </p>
          </div>
          <button
            onClick={() => setShowAddPathModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            + New Learning Path
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeIn('up', 0.2)} className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('my-learning')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-learning'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            My Learning
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'discover'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'saved'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Saved
          </button>
        </nav>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={fadeIn('up', 0.3)} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search learning paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            {skillLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
          >
            {resourceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div variants={fadeIn('up', 0.4)} className="space-y-8">
        {activeTab === 'my-learning' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">In Progress</h3>
            
            {filteredPaths.filter(path => path.progress > 0 && path.progress < 100).length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPaths
                  .filter(path => path.progress > 0 && path.progress < 100)
                  .map((path) => (
                    <motion.div 
                      key={path.id}
                      className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedPath(path)}
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">{path.title}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {path.level}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{path.description}</p>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{path.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${path.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1">
                            {path.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {skill}
                              </span>
                            ))}
                            {path.skills.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                +{path.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              <span>Next: {path.resources.find(r => !r.completed)?.title || 'Completed'}</span>
                            </div>
                            <button 
                              className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle continue learning
                              }}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active learning paths</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by adding a new learning path or exploring our recommendations.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('discover')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <LightBulbIcon className="-ml-1 mr-2 h-5 w-5" />
                    Browse Recommendations
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recommended for You</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendedPaths.slice(0, 3).map((path) => (
                  <motion.div 
                    key={path.id}
                    className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{path.title}</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Recommended
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{path.description}</p>
                      
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {path.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{path.resources.length} resources</span>
                          <button 
                            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                            onClick={() => {
                              // Add to my learning
                              if (!learningPaths.some(p => p.id === path.id)) {
                                setLearningPaths([...learningPaths, { ...path, progress: 0 }]);
                              }
                            }}
                          >
                            {learningPaths.some(p => p.id === path.id) ? 'Added' : 'Add to My Learning'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'discover' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPaths.map((path) => (
              <motion.div 
                key={path.id}
                className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                whileHover={{ y: -2 }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{path.title}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {path.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{path.description}</p>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {path.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {skill}
                        </span>
                      ))}
                      {path.skills.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                          +{path.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{path.resources.length} resources</span>
                      <button 
                        className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={() => {
                          // Add to my learning
                          if (!learningPaths.some(p => p.id === path.id)) {
                            setLearningPaths([...learningPaths, { ...path, progress: 0 }]);
                          }
                        }}
                      >
                        {learningPaths.some(p => p.id === path.id) ? 'Added' : 'Add to My Learning'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {activeTab === 'saved' && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No saved items</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Save interesting learning resources to access them later.
            </p>
          </div>
        )}
      </motion.div>

      {/* Learning Path Detail Modal */}
      <AnimatePresence>
        {selectedPath && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div 
                  className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"
                  onClick={() => setSelectedPath(null)}
                ></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          {selectedPath.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {selectedPath.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setSelectedPath(null)}
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Progress</h4>
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {selectedPath.progress}% Complete
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${selectedPath.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Learning Resources</h4>
                      <div className="space-y-3">
                        {selectedPath.resources.length > 0 ? (
                          selectedPath.resources.map((resource) => (
                            <div 
                              key={resource.id} 
                              className={`flex items-start p-3 rounded-lg border ${
                                resource.completed 
                                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' 
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <div className="flex-shrink-0 pt-0.5">
                                <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${
                                  resource.completed 
                                    ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800' 
                                    : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                                }`}>
                                  {resource.completed ? (
                                    <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                                  )}
                                </div>
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-medium ${
                                    resource.completed 
                                      ? 'text-green-800 dark:text-green-200' 
                                      : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {resource.title}
                                  </p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {resource.duration}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  {getResourceIcon(resource.type)}
                                  <span className="ml-1 capitalize">{resource.type}</span>
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button
                                  type="button"
                                  className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                    resource.completed
                                      ? 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/30'
                                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                  onClick={() => toggleResourceComplete(selectedPath.id, resource.id)}
                                >
                                  {resource.completed ? 'Completed' : 'Mark Complete'}
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No resources added yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Skills You'll Learn</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPath.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    onClick={() => {
                      // Start learning
                      if (!learningPaths.some(p => p.id === selectedPath.id)) {
                        setLearningPaths([...learningPaths, { ...selectedPath, progress: 0 }]);
                      }
                      setSelectedPath(null);
                    }}
                  >
                    {learningPaths.some(p => p.id === selectedPath.id) ? 'Continue Learning' : 'Start Learning'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setSelectedPath(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Learning Path Modal */}
      <AnimatePresence>
        {showAddPathModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div 
                  className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"
                  onClick={() => setShowAddPathModal(false)}
                ></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Create New Learning Path
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="path-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          id="path-title"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={newPath.title}
                          onChange={(e) => setNewPath({...newPath, title: e.target.value})}
                          placeholder="e.g., Advanced React Patterns"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="path-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          id="path-description"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={newPath.description}
                          onChange={(e) => setNewPath({...newPath, description: e.target.value})}
                          placeholder="What will you learn?"
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="path-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                          </label>
                          <input
                            type="text"
                            id="path-category"
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            value={newPath.category}
                            onChange={(e) => setNewPath({...newPath, category: e.target.value})}
                            placeholder="e.g., Web Development"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="path-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Level
                          </label>
                          <select
                            id="path-level"
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            value={newPath.level}
                            onChange={(e) => setNewPath({...newPath, level: e.target.value})}
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="path-skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Skills (comma separated)
                        </label>
                        <input
                          type="text"
                          id="path-skills"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          value={newPath.skills}
                          onChange={(e) => setNewPath({...newPath, skills: e.target.value})}
                          placeholder="e.g., React, Node.js, TypeScript"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                    onClick={handleAddPath}
                    disabled={!newPath.title || !newPath.description}
                  >
                    Create Learning Path
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowAddPathModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LearningHub;
