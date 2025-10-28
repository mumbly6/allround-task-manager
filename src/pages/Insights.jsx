import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animations';

const Insights = () => {
  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="show"
      variants={fadeIn}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Insights</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-700 dark:text-gray-300">
          Your insights and analytics will be displayed here. This could include:
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-700 dark:text-gray-300">
          <li>Productivity trends</li>
          <li>Task completion rates</li>
          <li>Time spent on different categories</li>
          <li>Weekly/Monthly performance metrics</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Insights;
