import BoardRepository from "../../boards/repositories/BoardRepository";

class TaskOperations {
  static getDefaultTasks() {
    const defaultBoard = BoardRepository.getDefaultBoard();

    const defaultTasks = [{ id: this.generateUniqueId(), title: 'Sample Item', boards: [defaultBoard.id] }];
    return defaultTasks;
  }

  static generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }  
}

export default TaskOperations;