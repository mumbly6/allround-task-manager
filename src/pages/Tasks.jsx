import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';
import Button from '../components/Button';
import TaskList from '../components/TaskList';
import TaskFilter from '../components/TaskFilter';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  // Simulate fetching tasks from an API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real app, you would fetch this from your backend
        const mockTasks = [
          {
            id: 1,
            title: 'Complete project proposal',
            description: 'Draft and finalize the project proposal document',
            dueDate: '2023-11-15',
            priority: 'high',
            status: 'in-progress',
            category: 'work',
            createdAt: '2023-11-10T09:00:00Z',
          },
          {
            id: 2,
            title: 'Review code changes',
            description: 'Review and provide feedback on the latest PR',
            dueDate: '2023-11-16',
            priority: 'medium',
            status: 'todo',
            category: 'development',
            createdAt: '2023-11-12T14:30:00Z',
          },
          {
            id: 3,
            title: 'Team meeting',
            description: 'Weekly team sync and planning',
            dueDate: '2023-11-17',
            priority: 'high',
            status: 'todo',
            category: 'meeting',
            createdAt: '2023-11-13T10:15:00Z',
          },
          {
            id: 4,
            title: 'Update documentation',
            description: 'Update API documentation for the new endpoints',
            dueDate: '2023-11-14',
            priority: 'low',
            status: 'completed',
            category: 'documentation',
            createdAt: '2023-11-09T16:45:00Z',
          },
        ];

        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    // Apply status filter
    if (filter === 'completed' && task.status !== 'completed') return false;
    if (filter === 'in-progress' && task.status !== 'in-progress') return false;
    if (filter === 'todo' && task.status !== 'todo') return false;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed' } 
        : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setShowFilter(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
          </p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/tasks/new')}
            className="flex items-center w-full sm:w-auto justify-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <Card className="mb-6">
          <TaskFilter 
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
        </Card>
      )}

      {/* Search Bar (shown when filter panel is hidden) */}
      {!showFilter && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <TaskList 
          tasks={filteredTasks} 
          onTaskComplete={handleTaskComplete}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <Card className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new task.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => navigate('/tasks/new')}
              className="inline-flex items-center"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Task
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Tasks;
