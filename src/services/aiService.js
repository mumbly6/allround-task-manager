import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION,
});

const openai = new OpenAIApi(configuration);

// Cache for storing user preferences and context
const userContext = {
  interests: [],
  pastTasks: [],
  productivityPatterns: {},
  learningStyle: 'visual', // visual, auditory, reading/writing, kinesthetic
  energyLevels: {},
};

export const analyzeTaskPatterns = async (tasks) => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps analyze task patterns and provide productivity insights.',
        },
        {
          role: 'user',
          content: `Analyze these tasks and provide insights on productivity patterns: ${JSON.stringify(tasks)}`,
        },
      ],
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing task patterns:', error);
    throw error;
  }
};

export const getPersonalizedSuggestions = async (userContext) => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI personal assistant that provides personalized task and learning suggestions based on user context.',
        },
        {
          role: 'user',
          content: `Based on this user context, provide personalized suggestions: ${JSON.stringify(userContext)}`,
        },
      ],
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting personalized suggestions:', error);
    throw error;
  }
};

export const generateTaskFromDescription = async (description) => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You help users break down tasks into actionable items. Return a JSON object with title, description, priority, and estimatedTime.',
        },
        {
          role: 'user',
          content: `Create a task from this description: ${description}`,
        },
      ],
    });

    return JSON.parse(completion.data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating task:', error);
    throw error;
  }
};

export const getMotivationalMessage = async () => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a motivational coach. Provide a short, uplifting message to help someone stay productive.',
        },
        {
          role: 'user',
          content: 'Give me a motivational message to stay productive.',
        },
      ],
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting motivational message:', error);
    return 'Keep up the great work! Every small step counts towards your goals.';
  }
};

// Function to update user context based on interactions
const updateUserContext = (interaction) => {
  // Update context based on interaction type
  switch (interaction.type) {
    case 'TASK_COMPLETION':
      userContext.pastTasks.push(interaction.data);
      break;
    case 'PREFERENCE_UPDATE':
      userContext.interests = [...new Set([...userContext.interests, ...interaction.data.interests])];
      break;
    case 'LEARNING_STYLE_UPDATE':
      userContext.learningStyle = interaction.data.learningStyle;
      break;
    default:
      break;
  }

  // Update productivity patterns based on time of day and task completion
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  
  if (!userContext.productivityPatterns[timeOfDay]) {
    userContext.productivityPatterns[timeOfDay] = { completed: 0, total: 0 };
  }
  
  if (interaction.type === 'TASK_COMPLETION') {
    userContext.productivityPatterns[timeOfDay].completed += 1;
  }
  
  userContext.productivityPatterns[timeOfDay].total += 1;
};

export const processUserFeedback = (feedback) => {
  // Analyze feedback and update AI behavior
  updateUserContext({
    type: 'FEEDBACK',
    data: feedback,
    timestamp: new Date().toISOString(),
  });

  // Return updated suggestions based on feedback
  return getPersonalizedSuggestions(userContext);
};

export const getContext = () => {
  return { ...userContext };
};
