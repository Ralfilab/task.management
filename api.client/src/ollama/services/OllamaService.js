import OllamaConfigurationRepository from '../repositories/OllamaConfigurationRepository';

class OllamaService {
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

    // Format all tasks for the prompt
    const taskList = tasks.map((task, index) => 
      this.formatTask(task, index + 1)
    ).join('\n');    

    const prompt = `You are a productivity assistant. Analyze these tasks and provide focused, actionable advice:

${taskList}

Instructions:
- Focus ONLY on these tasks above
- Tasks are already prioritized by the user, so don't prioritize them again.
- Provide specific, actionable advice (what to do, or how to manage your time)
- Consider urgency based on due dates
- Keep response concise: 2-3 sentences, maximum 100 characters
- Be direct and practical

Your advice:`;
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

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
