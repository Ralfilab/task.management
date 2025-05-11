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

  static shouldSendNotification(task, currentTime = new Date()) {
    if (!task.enableNotifications) {
      return false;
    }

    const lastNotification = this.getLastNotificationTime(task.id);
    if (!lastNotification) {
      return true;
    }

    const lastNotificationTime = new Date(lastNotification);
    let hoursSinceLastNotification = (currentTime - lastNotificationTime) / (1000 * 60 * 60);
    const completeDate = new Date(task.completeBy);
    const isOverdue = currentTime > completeDate;

    // For overdue tasks, use a more frequent notification schedule
    if (isOverdue) {
      hoursSinceLastNotification = hoursSinceLastNotification * -1
    }

    switch (task.notificationFrequency) {
      case 'hourly':
        return hoursSinceLastNotification >= 1;
      case 'daily':
        return hoursSinceLastNotification >= 12; // Twice daily for overdue tasks
      case 'weekly':
        return hoursSinceLastNotification >= 24; // Daily for overdue tasks
      default:
        return hoursSinceLastNotification >= 24; // Default to daily for overdue tasks
    }    
  }
}

export default BrowserNotificationRepository; 