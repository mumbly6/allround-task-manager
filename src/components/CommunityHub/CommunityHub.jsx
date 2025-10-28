import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fadeIn, 
  staggerContainer, 
  slideIn 
} from '../../utils/animations';
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  ThumbUpIcon,
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
  DotsHorizontalIcon,
  ShareIcon,
  BookmarkIcon,
  FlagIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Mock data - in a real app, this would come from an API
const initialPosts = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Productivity Coach',
      isOnline: true
    },
    content: 'Just completed a 10-day productivity challenge! Here are my top 3 takeaways:',
    media: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: false,
    timestamp: '2 hours ago',
    tags: ['productivity', 'challenge', 'achievement']
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Sam Taylor',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'UX Designer',
      isOnline: false
    },
    content: 'Looking for recommendations on the best task management tools for designers. What\'s your favorite?',
    likes: 12,
    comments: 5,
    shares: 1,
    isLiked: true,
    isBookmarked: true,
    timestamp: '5 hours ago',
    tags: ['tools', 'design', 'discussion']
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Jordan Lee',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      role: 'Software Engineer',
      isOnline: true
    },
    content: 'Sharing my morning routine that helps me stay productive throughout the day. What does your routine look like?',
    media: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    likes: 42,
    comments: 15,
    shares: 7,
    isLiked: false,
    isBookmarked: false,
    timestamp: '1 day ago',
    tags: ['routine', 'productivity', 'habits']
  }
];

const suggestedConnections = [
  {
    id: 4,
    name: 'Taylor Morgan',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    role: 'Product Manager',
    mutualConnections: 3,
    isConnected: false
  },
  {
    id: 5,
    name: 'Casey Smith',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    role: 'DevOps Engineer',
    mutualConnections: 2,
    isConnected: false
  },
  {
    id: 6,
    name: 'Jamie Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    role: 'UX Researcher',
    mutualConnections: 5,
    isConnected: true
  }
];

const trendingTopics = [
  { id: 1, name: '#MorningRoutine', posts: '24.5K' },
  { id: 2, name: '#ProductivityHacks', posts: '18.2K' },
  { id: 3, name: '#RemoteWork', posts: '15.7K' },
  { id: 4, name: '#Mindfulness', posts: '12.9K' },
  { id: 5, name: '#TimeManagement', posts: '10.3K' }
];

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState(suggestedConnections);
  const [isLoading, setIsLoading] = useState(false);

  // Handle liking a post
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Handle bookmarking a post
  const handleBookmark = (postId) => {
    setPosts(posts.map(post => ({
      ...post,
      isBookmarked: post.id === postId ? !post.isBookmarked : post.isBookmarked
    })));
  };

  // Handle connecting with a user
  const handleConnect = (userId) => {
    setConnections(connections.map(connection => {
      if (connection.id === userId) {
        return {
          ...connection,
          isConnected: !connection.isConnected
        };
      }
      return connection;
    }));
  };

  // Handle posting a new comment
  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;
    
    // In a real app, this would be an API call
    const newComment = {
      id: Date.now(),
      user: {
        id: 0, // Current user
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'Member'
      },
      content: commentText,
      timestamp: 'Just now',
      likes: 0
    };
    
    // Update the post with the new comment
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: (post.comments || 0) + 1,
          commentsList: [...(post.commentsList || []), newComment]
        };
      }
      return post;
    }));
    
    setCommentText('');
    // Close the comment section after a delay
    setTimeout(() => {
      setExpandedPost(null);
    }, 1000);
  };

  // Handle creating a new post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const newPostObj = {
      id: Date.now(),
      user: {
        id: 0, // Current user
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'Member',
        isOnline: true
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      timestamp: 'Just now',
      tags: newPost.match(/#\w+/g) || []
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setShowNewPostModal(false);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.tags && post.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase().replace('#', ''))
    ))
  );

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Hub</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Connect, share, and grow with like-minded individuals
            </p>
          </div>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Post
          </button>
        </div>
      </motion.div>

      {/* Search and Tabs */}
      <motion.div variants={fadeIn('up', 0.2)} className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search posts, people, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'feed'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            My Feed
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'discover'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'connections'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'groups'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Groups
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tab Content */}
          {activeTab === 'feed' || activeTab === 'discover' ? (
            <>
              {/* Create Post Card */}
              <motion.div 
                variants={fadeIn('up', 0.3)}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src="https://randomuser.me/api/portraits/men/1.jpg" 
                        alt="User avatar"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => setShowNewPostModal(true)}
                        className="w-full text-left bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        What's on your mind?
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                    <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                      <svg className="h-5 w-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      Photo/Video
                    </button>
                    <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                      <svg className="h-5 w-5 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2v2H5a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2H9V7a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Poll
                    </button>
                    <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                      <svg className="h-5 w-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM7 9a1 1 0 100-2v2H5a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2H9V7a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Question
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Posts */}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.div 
                    key={post.id}
                    variants={fadeIn('up', 0.4 + (index * 0.1))}
                    className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 relative">
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={post.user.avatar} 
                              alt={post.user.name}
                            />
                            {post.user.isOnline && (
                              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {post.user.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {post.user.role} • {post.timestamp}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                          <DotsHorizontalIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Post Content */}
                      <div className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                        {post.content.split(' ').map((word, i) => {
                          if (word.startsWith('#')) {
                            return (
                              <span key={i} className="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                                {word}{' '}
                              </span>
                            );
                          }
                          return word + ' ';
                        })}
                      </div>
                      
                      {/* Post Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Post Media */}
                      {post.media && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img 
                            className="w-full h-auto max-h-96 object-cover rounded-lg" 
                            src={post.media} 
                            alt="Post media"
                          />
                        </div>
                      )}
                      
                      {/* Post Actions */}
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-b border-gray-200 dark:border-gray-700 py-2">
                        <button 
                          className={`flex items-center space-x-1 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            post.isLiked ? 'text-blue-500' : ''
                          }`}
                          onClick={() => handleLike(post.id)}
                        >
                          <ThumbUpIcon className="h-4 w-4" />
                          <span>{post.likes} Likes</span>
                        </button>
                        <button 
                          className="flex items-center space-x-1 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        >
                          <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                          <span>{post.comments} Comments</span>
                        </button>
                        <button className="flex items-center space-x-1 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ShareIcon className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                        <button 
                          className="flex items-center space-x-1 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleBookmark(post.id)}
                        >
                          <BookmarkIcon 
                            className={`h-4 w-4 ${post.isBookmarked ? 'text-yellow-500 fill-current' : ''}`} 
                          />
                          <span>Save</span>
                        </button>
                      </div>
                      
                      {/* Comments Section */}
                      <AnimatePresence>
                        {expandedPost === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-3 overflow-hidden"
                          >
                            {/* Comment Input */}
                            <div className="flex items-start space-x-2">
                              <img 
                                className="h-8 w-8 rounded-full" 
                                src="https://randomuser.me/api/portraits/men/1.jpg" 
                                alt="User avatar"
                              />
                              <div className="flex-1">
                                <div className="flex rounded-md shadow-sm">
                                  <input
                                    type="text"
                                    className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                  />
                                  <button
                                    type="button"
                                    className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    onClick={() => handleAddComment(post.id)}
                                  >
                                    Post
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Comments List */}
                            {post.commentsList && post.commentsList.length > 0 ? (
                              <div className="space-y-3 mt-3">
                                {post.commentsList.map((comment) => (
                                  <div key={comment.id} className="flex items-start space-x-2">
                                    <img 
                                      className="h-8 w-8 rounded-full" 
                                      src={comment.user.avatar} 
                                      alt={comment.user.name}
                                    />
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                          {comment.user.name}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {comment.timestamp}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                        {comment.content}
                                      </p>
                                      <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                        <button className="hover:text-gray-700 dark:hover:text-gray-300">
                                          Like
                                        </button>
                                        <span>•</span>
                                        <button className="hover:text-gray-700 dark:hover:text-gray-300">
                                          Reply
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                                No comments yet. Be the first to comment!
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  variants={fadeIn('up', 0.3)}
                  className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow"
                >
                  <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery 
                      ? 'No posts match your search. Try different keywords.'
                      : 'Be the first to share something with the community!'
                    }
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowNewPostModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Create Post
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          ) : activeTab === 'connections' ? (
            <motion.div 
              variants={fadeIn('up', 0.3)}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Connections</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Connect with professionals and grow your network
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 relative">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={connection.avatar} 
                            alt={connection.name}
                          />
                          {connection.isOnline && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {connection.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {connection.role} • {connection.mutualConnections} mutual connections
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnect(connection.id)}
                        className={`inline-flex items-center px-3 py-1.5 border ${
                          connection.isConnected 
                            ? 'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                      >
                        {connection.isConnected ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    View all connections
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={fadeIn('up', 0.3)}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Groups</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Join groups to connect with people who share your interests
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No groups yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Join or create a group to get started
                  </p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Create Group
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <motion.div 
            variants={fadeIn('up', 0.3)}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Upcoming Events</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-500 text-white rounded-md p-2 text-center w-14">
                    <div className="text-sm font-medium">JUN</div>
                    <div className="text-xl font-bold">15</div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Productivity Workshop</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2:00 PM - 4:00 PM</p>
                    <button className="mt-1 text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                      Learn more
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-500 text-white rounded-md p-2 text-center w-14">
                    <div className="text-sm font-medium">JUN</div>
                    <div className="text-xl font-bold">20</div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Mindfulness Session</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">10:00 AM - 11:00 AM</p>
                    <button className="mt-1 text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  View all events
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Trending Topics */}
          <motion.div 
            variants={fadeIn('up', 0.4)}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Trending Topics</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between">
                    <a 
                      href={`#${topic.name}`} 
                      className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {topic.name}
                    </a>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{topic.posts} posts</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search topics..."
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Suggested Connections */}
          <motion.div 
            variants={fadeIn('up', 0.5)}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">People You May Know</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {suggestedConnections.slice(0, 3).map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src={connection.avatar} 
                        alt={connection.name}
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {connection.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {connection.mutualConnections} mutual connections
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(connection.id)}
                      className={`inline-flex items-center px-2.5 py-1 border ${
                        connection.isConnected 
                          ? 'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm'
                      } font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                    >
                      {connection.isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  See all suggestions
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div 
                  className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"
                  onClick={() => setShowNewPostModal(false)}
                ></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Create Post
                    </h3>
                    <button
                      type="button"
                      className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setShowNewPostModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-start space-x-3">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src="https://randomuser.me/api/portraits/men/1.jpg" 
                        alt="User avatar"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="border-b border-gray-200 dark:border-gray-700 focus-within:border-primary-500 dark:focus-within:border-primary-400">
                          <label htmlFor="new-post" className="sr-only">What's on your mind?</label>
                          <textarea
                            rows={4}
                            name="new-post"
                            id="new-post"
                            className="block w-full border-0 border-b border-transparent p-0 pb-2 resize-none focus:ring-0 focus:border-primary-500 sm:text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="What's on your mind?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                          />
                        </div>
                        
                        <div className="pt-2 flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <button
                              type="button"
                              onClick={handleCreatePost}
                              disabled={!newPost.trim()}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                newPost.trim() 
                                  ? 'bg-primary-600 hover:bg-primary-700' 
                                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommunityHub;
