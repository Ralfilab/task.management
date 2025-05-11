class BrowserNotificationRepository {
  static storageKey = 'wickedTaskNotificationHistory';

  static get() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }
  
  static save(history) {
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  static getLastNotificationTime(taskId) {
    const history = this.get();
    const entry = history.find(item => item.taskId === taskId);
    return entry ? entry.lastNotificationTime : null;
  }

  static updateLastNotificationTime(taskId) {
    const history = this.get();
    const entryIndex = history.findIndex(item => item.taskId === taskId);
    
    if (entryIndex !== -1) {
      history[entryIndex].lastNotificationTime = new Date().toISOString();
    } else {
      history.push({
        taskId,
        lastNotificationTime: new Date().toISOString()
      });
    }
    
    this.save(history);
  }  
}

export default BrowserNotificationRepository; 