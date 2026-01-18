import OllamaConfigurationRepository from '../repositories/OllamaConfigurationRepository';

class OllamaService {
  /**
   * Randomly selects a subset of tasks from the given list
   * @param {Array} tasks - Array of task objects
   * @param {number} maxTasks - Maximum number of tasks to select (default: 4)
   * @returns {Array} Randomly selected subset of tasks
   */
  static selectRandomTasks(tasks, maxTasks = 4) {
    if (tasks.length <= maxTasks) {
      return tasks;
    }
    
    // Create a shuffled copy of the array
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxTasks);
  }

  /**
   * Formats a task for display in the prompt
   * @param {Object} task - Task object
   * @param {number} index - Index in the list
   * @returns {string} Formatted task string
   */
  static formatTask(task, index) {
    const taskInfo = `${index + 1}. ${task.title}`;
    const parts = [taskInfo];
    
    if (task.completeBy) {
      const dueDate = new Date(task.completeBy);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) {
        parts.push(`(OVERDUE - ${Math.abs(daysUntilDue)} days late)`);
      } else if (daysUntilDue <= 3) {
        parts.push(`(Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} - URGENT)`);
      } else {
        parts.push(`(Due: ${dueDate.toLocaleDateString()})`);
      }
    }
    
    if (task.description) {
      const shortDesc = task.description.replace(/<[^>]*>/g, '').substring(0, 50);
      if (shortDesc) {
        parts.push(`- ${shortDesc}${task.description.length > 50 ? '...' : ''}`);
      }
    }
    
    return parts.join(' ');
  }

  static async getTaskAdvice(tasks) {
    const config = OllamaConfigurationRepository.get();
    
    if (!config.enabled) {
      throw new Error('Ollama is not enabled');
    }

    // Select a random subset of tasks (3-5 tasks)
    const selectedTasks = this.selectRandomTasks(tasks, 4);
    
    // Format selected tasks for the prompt
    const taskList = selectedTasks.map((task, index) => 
      this.formatTask(task, index + 1)
    ).join('\n');

    const taskCount = selectedTasks.length;
    const totalCount = tasks.length;
    const contextNote = totalCount > taskCount 
      ? `Note: You are analyzing ${taskCount} randomly selected tasks from a total of ${totalCount} tasks.`
      : '';

    const prompt = `You are a productivity assistant. Analyze these specific tasks and provide focused, actionable advice:

${taskList}

${contextNote}

Instructions:
- Focus ONLY on these ${taskCount} tasks listed above
- Provide specific, actionable advice (what to do, how to prioritize, or time management tips)
- Consider urgency based on due dates
- Keep response concise: 2-3 sentences, maximum 200 characters, no line breaks
- Be direct and practical

Your advice:`;
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.message && data.message.content) {
        return data.message.content.trim();
      }
      
      throw new Error('Invalid response format from Ollama');
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request to Ollama timed out. Please check if Ollama is running.');
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to Ollama. Please check if Ollama is running and the URL is correct.');
      }
      throw error;
    }
  }

  static shouldRunCheck() {
    const config = OllamaConfigurationRepository.get();
    
    if (!config.enabled) {
      return false;
    }

    if (!config.lastRun) {
      return true;
    }

    const lastRun = new Date(config.lastRun);
    const now = new Date();
    const hoursSinceLastRun = (now - lastRun) / (1000 * 60 * 60);
    
    return hoursSinceLastRun >= 1;
  }
}

export default OllamaService;
