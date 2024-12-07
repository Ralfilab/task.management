 class TaskOperations {
  static getDefaultTasks() {
    const defaultTasks = [{ id: this.generateUniqueId(), title: 'Sample Item' }];
    return defaultTasks;
  }

  static generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }
}

export default TaskOperations;