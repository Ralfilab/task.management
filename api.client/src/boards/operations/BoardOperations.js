class BoardOperations {
  static getDefaultBoards() {
    const defaultTasks = [{ id: this.generateUniqueId(), title: 'My first board' }];
    return defaultTasks;
  }

  static generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }
}

export default BoardOperations;