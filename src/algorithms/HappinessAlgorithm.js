// Happiness Algorithm - Optimizes task scheduling based on mood and energy levels

// Mood and energy scoring
const MOOD_WEIGHTS = {
  excited: 1.2,
  happy: 1.1,
  neutral: 1.0,
  tired: 0.8,
  stressed: 0.6
};

const ENERGY_WEIGHTS = {
  high: 1.2,
  medium: 1.0,
  low: 0.7
};

// Task type definitions with their ideal conditions
const TASK_TYPES = {
  CREATIVE: {
    name: 'Creative Work',
    idealMood: ['excited', 'happy'],
    idealEnergy: 'high',
    timeOfDay: 'morning',
    duration: 90, // minutes
  },
  ANALYTICAL: {
    name: 'Analytical Work',
    idealMood: ['neutral', 'happy'],
    idealEnergy: 'high',
    timeOfDay: 'morning',
    duration: 60,
  },
  ROUTINE: {
    name: 'Routine Tasks',
    idealMood: ['neutral', 'tired'],
    idealEnergy: 'medium',
    timeOfDay: 'afternoon',
    duration: 30,
  },
  LEARNING: {
    name: 'Learning New Skills',
    idealMood: ['excited', 'happy'],
    idealEnergy: 'medium',
    timeOfDay: 'morning',
    duration: 45,
  },
  PLANNING: {
    name: 'Planning & Strategy',
    idealMood: ['neutral', 'happy'],
    idealEnergy: 'medium',
    timeOfDay: 'afternoon',
    duration: 60,
  },
  PHYSICAL: {
    name: 'Physical Activity',
    idealMood: ['excited', 'happy', 'stressed'],
    idealEnergy: 'high',
    timeOfDay: 'afternoon',
    duration: 45,
  },
  SOCIAL: {
    name: 'Social & Communication',
    idealMood: ['happy', 'excited'],
    idealEnergy: 'medium',
    timeOfDay: 'afternoon',
    duration: 60,
  },
  RELAXATION: {
    name: 'Relaxation & Self-care',
    idealMood: ['tired', 'stressed'],
    idealEnergy: 'low',
    timeOfDay: 'evening',
    duration: 30,
  },
};

// Time of day mapping
const TIME_OF_DAY = {
  MORNING: { start: 6, end: 12 },
  AFTERNOON: { start: 12, end: 18 },
  EVENING: { start: 18, end: 22 },
  NIGHT: { start: 22, end: 6 },
};

class HappinessAlgorithm {
  constructor(userPreferences = {}) {
    this.userPreferences = {
      preferredWakeTime: 7, // 7 AM
      preferredBedtime: 23, // 11 PM
      workHours: { start: 9, end: 17 }, // 9 AM - 5 PM
      ...userPreferences,
    };
    
    // Load historical data if available
    this.historicalData = this.loadHistoricalData();
  }

  // Load historical mood and productivity data
  loadHistoricalData() {
    try {
      const savedData = localStorage.getItem('happinessAlgorithmData');
      return savedData ? JSON.parse(savedData) : {
        moodHistory: [],
        taskPerformance: [],
        optimalTimes: {},
      };
    } catch (error) {
      console.error('Error loading historical data:', error);
      return {
        moodHistory: [],
        taskPerformance: [],
        optimalTimes: {},
      };
    }
  }

  // Save historical data
  saveHistoricalData() {
    try {
      localStorage.setItem('happinessAlgorithmData', JSON.stringify(this.historicalData));
    } catch (error) {
      console.error('Error saving historical data:', error);
    }
  }

  // Record a new mood and energy entry
  recordMoodEnergy(mood, energy, timestamp = new Date()) {
    const entry = {
      mood,
      energy,
      timestamp: timestamp.toISOString(),
      timeOfDay: this.getTimeOfDay(timestamp),
    };

    this.historicalData.moodHistory.push(entry);
    this.saveHistoricalData();
    this.updateOptimalTimes();
  }

  // Record task completion with performance metrics
  recordTaskCompletion(task, performanceMetrics) {
    const entry = {
      taskId: task.id,
      taskType: task.type,
      completionTime: new Date().toISOString(),
      timeOfDay: this.getTimeOfDay(),
      ...performanceMetrics,
    };

    this.historicalData.taskPerformance.push(entry);
    this.saveHistoricalData();
    this.updateOptimalTimes();
  }

  // Update optimal times based on historical data
  updateOptimalTimes() {
    const optimalTimes = {};
    
    // Analyze mood and energy patterns
    const moodByTime = {};
    const energyByTime = {};
    
    this.historicalData.moodHistory.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      moodByTime[hour] = moodByTime[hour] || [];
      energyByTime[hour] = energyByTime[hour] || [];
      
      moodByTime[hour].push(MOOD_WEIGHTS[entry.mood] || 1);
      energyByTime[hour].push(ENERGY_WEIGHTS[entry.energy] || 1);
    });
    
    // Calculate average mood and energy for each hour
    const hourlyAverages = {};
    for (const [hour, moods] of Object.entries(moodByTime)) {
      const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
      const avgEnergy = energyByTime[hour]
        ? energyByTime[hour].reduce((a, b) => a + b, 0) / energyByTime[hour].length
        : 1;
      
      hourlyAverages[hour] = {
        mood: avgMood,
        energy: avgEnergy,
        score: (avgMood + avgEnergy) / 2,
      };
    }
    
    // Find best hours for different task types
    for (const [taskType, taskInfo] of Object.entries(TASK_TYPES)) {
      const scores = [];
      
      for (const [hour, data] of Object.entries(hourlyAverages)) {
        const hourNum = parseInt(hour, 10);
        const timeOfDay = this.getTimeOfDay(new Date().setHours(hourNum));
        
        // Base score on mood and energy alignment with task type
        let score = data.score;
        
        // Bonus for matching ideal time of day
        if (taskInfo.timeOfDay === timeOfDay.toLowerCase()) {
          score *= 1.2;
        }
        
        // Bonus for matching ideal energy
        const energyMatch = taskInfo.idealEnergy === 'high' ? data.energy : 
                          taskInfo.idealEnergy === 'medium' ? 1 - Math.abs(0.5 - data.energy) * 2 :
                          1 - data.energy;
        
        // Bonus for matching ideal mood
        const moodMatch = taskInfo.idealMood.includes(this.getMoodFromScore(data.mood)) ? 1.2 : 1;
        
        // Adjust score
        score = score * 0.6 + (energyMatch * 0.2) + (moodMatch * 0.2);
        
        scores.push({ hour: hourNum, score });
      }
      
      // Sort by score and take top 3 hours
      optimalTimes[taskType] = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => ({
          hour: item.hour,
          timeLabel: this.getTimeLabel(item.hour),
          score: Math.round(item.score * 100) / 100,
        }));
    }
    
    this.historicalData.optimalTimes = optimalTimes;
    this.saveHistoricalData();
    
    return optimalTimes;
  }

  // Get the best time to perform a specific task type
  getOptimalTimeForTask(taskType, dayOffset = 0) {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + dayOffset);
    
    const optimalTimes = this.historicalData.optimalTimes[taskType] || [];
    
    if (optimalTimes.length === 0) {
      // Fallback to default time if no data available
      const defaultTime = TASK_TYPES[taskType]?.timeOfDay || 'afternoon';
      const hour = defaultTime === 'morning' ? 10 : 
                  defaultTime === 'afternoon' ? 14 : 
                  defaultTime === 'evening' ? 19 : 10;
      
      targetDate.setHours(hour, 0, 0, 0);
      return {
        time: targetDate,
        confidence: 0.5,
        reason: 'Using default time due to insufficient data',
      };
    }
    
    // Get the best time slot that's in the future
    const nowHour = now.getHours();
    const bestTime = optimalTimes.find(slot => slot.hour > nowHour) || optimalTimes[0];
    
    targetDate.setHours(bestTime.hour, 0, 0, 0);
    
    return {
      time: targetDate,
      confidence: bestTime.score,
      reason: `Based on your historical mood and energy patterns, this is an optimal time for ${TASK_TYPES[taskType]?.name.toLowerCase() || 'this task'}.`,
    };
  }

  // Schedule tasks based on current state and historical data
  scheduleTasks(tasks = []) {
    if (!tasks.length) return [];
    
    const now = new Date();
    const currentHour = now.getHours();
    const timeOfDay = this.getTimeOfDay(now);
    
    // Score each task based on current conditions
    const scoredTasks = tasks.map(task => {
      const taskType = task.type || 'ROUTINE';
      const taskInfo = TASK_TYPES[taskType] || TASK_TYPES.ROUTINE;
      
      // Base score on task priority
      let score = task.priority === 'high' ? 1.5 : 
                 task.priority === 'medium' ? 1.2 : 1.0;
      
      // Adjust based on time of day
      const timeMatch = taskInfo.timeOfDay === timeOfDay.toLowerCase() ? 1.2 : 0.9;
      
      // Consider deadline proximity
      const deadlineScore = this.calculateDeadlineScore(task.deadline);
      
      // Consider historical performance
      const historicalScore = this.calculateHistoricalPerformanceScore(task);
      
      // Combine scores with weights
      score = score * 0.4 + 
              timeMatch * 0.2 + 
              deadlineScore * 0.3 + 
              historicalScore * 0.1;
      
      return {
        ...task,
        _score: score,
        _suggestedTime: this.getOptimalTimeForTask(taskType),
      };
    });
    
    // Sort by score (descending)
    return scoredTasks.sort((a, b) => b._score - a._score);
  }

  // Calculate a score based on task deadline
  calculateDeadlineScore(deadline) {
    if (!deadline) return 0.5;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffHours = (deadlineDate - now) / (1000 * 60 * 60);
    
    if (diffHours <= 0) return 2.0; // Overdue
    if (diffHours <= 24) return 1.8; // Due today
    if (diffHours <= 48) return 1.5; // Due tomorrow
    if (diffHours <= 168) return 1.2; // Due this week
    return 0.8; // Not urgent
  }

  // Calculate score based on historical performance
  calculateHistoricalPerformanceScore(task) {
    const similarTasks = this.historicalData.taskPerformance
      .filter(t => t.taskType === task.type)
      .sort((a, b) => new Date(b.completionTime) - new Date(a.completionTime))
      .slice(0, 5); // Consider only the 5 most recent similar tasks
    
    if (similarTasks.length === 0) return 0.5; // Neutral score if no data
    
    // Calculate average performance score (assuming 0-1 scale where higher is better)
    const avgPerformance = similarTasks.reduce((sum, t) => {
      return sum + (t.performanceScore || 0.5);
    }, 0) / similarTasks.length;
    
    return avgPerformance;
  }

  // Get time of day (morning, afternoon, evening, night)
  getTimeOfDay(date = new Date()) {
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  // Convert hour to time label (e.g., 14 -> "2 PM")
  getTimeLabel(hour) {
    return new Date().setHours(hour, 0, 0, 0).toLocaleTimeString([], { hour: 'numeric', hour12: true });
  }

  // Convert mood score back to mood label
  getMoodFromScore(score) {
    if (score >= 1.1) return 'excited';
    if (score >= 1.0) return 'happy';
    if (score >= 0.9) return 'neutral';
    if (score >= 0.7) return 'tired';
    return 'stressed';
  }
  
  // Get recommendations for the current time
  getCurrentRecommendations() {
    const now = new Date();
    const currentHour = now.getHours();
    const timeOfDay = this.getTimeOfDay(now);
    
    // Get recent mood and energy (last 3 entries or default)
    const recentMoods = [...this.historicalData.moodHistory]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3);
    
    const avgMood = recentMoods.length > 0
      ? recentMoods.reduce((sum, m) => sum + (MOOD_WEIGHTS[m.mood] || 1), 0) / recentMoods.length
      : 1.0;
      
    const avgEnergy = recentMoods.length > 0
      ? recentMoods.reduce((sum, m) => sum + (ENERGY_WEIGHTS[m.energy] || 1), 0) / recentMoods.length
      : 1.0;
    
    // Determine best task types for current conditions
    const recommendedTaskTypes = [];
    
    for (const [type, info] of Object.entries(TASK_TYPES)) {
      let score = 1.0;
      
      // Bonus for matching time of day
      if (info.timeOfDay === timeOfDay) score *= 1.2;
      
      // Adjust for mood
      const moodMatch = info.idealMood.includes(this.getMoodFromScore(avgMood));
      if (moodMatch) score *= 1.3;
      
      // Adjust for energy
      const energyLevel = avgEnergy > 1.1 ? 'high' : avgEnergy > 0.9 ? 'medium' : 'low';
      if (info.idealEnergy === energyLevel) score *= 1.2;
      
      recommendedTaskTypes.push({
        type,
        name: info.name,
        score,
        idealDuration: info.duration,
      });
    }
    
    // Sort by score and take top 3
    const topTasks = recommendedTaskTypes
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    // Generate recommendation message
    const moodLabel = this.getMoodFromScore(avgMood);
    const energyLabel = avgEnergy > 1.1 ? 'high' : avgEnergy > 0.9 ? 'medium' : 'low';
    
    let recommendation = '';
    
    if (moodLabel === 'stressed' && energyLabel === 'low') {
      recommendation = "You seem to be feeling stressed with low energy. Consider taking a short break or doing a relaxing activity to recharge.";
    } else if (moodLabel === 'excited' && energyLabel === 'high') {
      recommendation = "You're feeling great with high energy! This is a perfect time to tackle challenging or creative tasks.";
    } else if (energyLabel === 'high') {
      recommendation = `With your current energy level, you'd be great at ${topTasks[0].name.toLowerCase()} or ${topTasks[1].name.toLowerCase()} right now.`;
    } else if (energyLabel === 'low') {
      recommendation = `You might want to focus on lighter tasks like ${topTasks[0].name.toLowerCase()} or take a short break to recharge.`;
    } else {
      recommendation = `Based on your current state, consider working on ${topTasks[0].name.toLowerCase()} or ${topTasks[1].name.toLowerCase()}.`;
    }
    
    return {
      currentState: {
        mood: moodLabel,
        energy: energyLabel,
        timeOfDay,
      },
      recommendedTasks: topTasks,
      recommendation,
      optimalProductivityWindow: this.findOptimalProductivityWindow(),
    };
  }
  
  // Find the most productive time window based on historical data
  findOptimalProductivityWindow() {
    const productivityByHour = {};
    
    // Initialize hours
    for (let hour = 0; hour < 24; hour++) {
      productivityByHour[hour] = {
        mood: 0,
        energy: 0,
        count: 0,
      };
    }
    
    // Calculate average mood and energy for each hour
    this.historicalData.moodHistory.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      productivityByHour[hour].mood += MOOD_WEIGHTS[entry.mood] || 1;
      productivityByHour[hour].energy += ENERGY_WEIGHTS[entry.energy] || 1;
      productivityByHour[hour].count++;
    });
    
    // Calculate averages and overall score
    let bestWindow = { start: 9, end: 11, score: 0 }; // Default morning window
    
    // Consider different window sizes (1-4 hours)
    for (let windowSize = 1; windowSize <= 4; windowSize++) {
      for (let startHour = 0; startHour <= 24 - windowSize; startHour++) {
        let totalScore = 0;
        let validHours = 0;
        
        for (let h = startHour; h < startHour + windowSize; h++) {
          const hour = h % 24;
          const data = productivityByHour[hour];
          
          if (data.count > 0) {
            const avgMood = data.mood / data.count;
            const avgEnergy = data.energy / data.count;
            totalScore += (avgMood + avgEnergy) / 2;
            validHours++;
          }
        }
        
        const avgScore = validHours > 0 ? totalScore / validHours : 0;
        
        // Bonus for longer windows with consistent scores
        const consistencyBonus = windowSize * 0.1;
        const windowScore = avgScore * (1 + consistencyBonus);
        
        if (windowScore > bestWindow.score) {
          bestWindow = {
            start: startHour,
            end: (startHour + windowSize) % 24,
            score: windowScore,
            windowSize,
          };
        }
      }
    }
    
    // Format the window for display
    const formatHour = (hour) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour} ${period}`;
    };
    
    return {
      startHour: bestWindow.start,
      endHour: bestWindow.end,
      display: `${formatHour(bestWindow.start)} - ${formatHour(bestWindow.end)}`,
      confidence: Math.min(Math.round(bestWindow.score * 50), 100), // Scale to 0-100%
    };
  }
}

export default HappinessAlgorithm;
