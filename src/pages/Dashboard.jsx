import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckCircleIcon, ClockIcon, LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    productivityScore: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this from your backend
        const mockData = {
          stats: {
            totalTasks: 24,
            completedTasks: 16,
            pendingTasks: 8,
            productivityScore: 78,
          },
          recentTasks: [
            { id: 1, title: 'Complete project proposal', dueDate: '2023-11-15', completed: false },
            { id: 2, title: 'Review code changes', dueDate: '2023-11-16', completed: true },
            { id: 3, title: 'Team meeting', dueDate: '2023-11-17', completed: false },
          ],
          suggestions: [
            { id: 1, type: 'time-management', title: 'Pomodoro Technique', description: 'Try working in 25-minute focused intervals' },
            { id: 2, type: 'learning', title: 'React Hooks', description: 'Learn about useReducer for complex state logic' },
          ],
        };

        setStats(mockData.stats);
        setRecentTasks(mockData.recentTasks);
        setSuggestions(mockData.suggestions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button variant="primary" as={Link} to="/tasks/new">
          Add New Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<CheckCircleIcon className="h-6 w-6 text-primary-500" />}
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          title="Completed"
          value={stats.completedTasks}
          icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
          color="bg-green-100 dark:bg-green-900/30"
        />
        <StatCard
          title="Pending"
          value={stats.pendingTasks}
          icon={<ClockIcon className="h-6 w-6 text-yellow-500" />}
          color="bg-yellow-100 dark:bg-yellow-900/30"
        />
        <StatCard
          title="Productivity"
          value={`${stats.productivityScore}%`}
          icon={<ChartBarIcon className="h-6 w-6 text-purple-500" />}
          color="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Tasks</h2>
            </Card.Header>
            <Card.Body>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentTasks.length > 0 ? (
                    recentTasks.map((task) => (
                      <li key={task.id} className="py-4">
                        <div className="flex items-center">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {task.completed ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent tasks found</p>
                  )}
                </ul>
              </div>
            </Card.Body>
            <Card.Footer className="bg-gray-50 dark:bg-gray-800/50">
              <Button variant="ghost" as={Link} to="/tasks" className="w-full justify-center">
                View All Tasks
              </Button>
            </Card.Footer>
          </Card>
        </div>

        {/* AI Suggestions */}
        <div>
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">AI Suggestions</h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {suggestion.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No suggestions available. Complete more tasks to get personalized recommendations.
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Card className={`${color} border-0`}>
    <Card.Body className="flex items-center">
      <div className="p-3 rounded-full bg-white/50 dark:bg-black/20 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </Card.Body>
  </Card>
);

export default Dashboard;
