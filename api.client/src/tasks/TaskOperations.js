 class TaskOperations {
  static addDefaultTasks() {
    const defaultTasks = [{ id: this.generateUniqueId(), title: 'Sample Item' }];
    return defaultTasks;
  }

  static generateUniqueId() {
    Date.now() + Math.random().toString(36).substr(2, 9);
  }
}

export default TaskOperations;