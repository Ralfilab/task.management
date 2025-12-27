import BoardRepository from "../../boards/repositories/BoardRepository";

class TaskOperations {
  static async getDefaultTasks() {
    const defaultBoard = BoardRepository.getDefaultBoard();

    try {
      const response = await fetch('/DefaultTasks');
      if (!response.ok) {
        throw new Error(`Failed to fetch default tasks: ${response.statusText}`);
      }
      const titles = await response.json();

      const defaultTasks = Array.isArray(titles)
        ? titles.map(title => ({
            id: this.generateUniqueId(),
            title: title,
            boards: [defaultBoard.id]
          }))
        : [];

      return defaultTasks;
    } catch (error) {
      console.error('Error fetching default tasks:', error);
      return [];
    }
  }

  static generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }  
}

export default TaskOperations;