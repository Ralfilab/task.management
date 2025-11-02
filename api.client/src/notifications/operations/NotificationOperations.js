import NotificationRepository from '../repositories/NotificationRepository';

class NotificationOperations {    
  static checkTaskDueDates(items, showNotificationCallback) {    
      const now = new Date();      
    
      items.forEach(item => {
        if (!this.shouldSendNotification(item)) {
          return;
        }

        const completeDate = new Date(item.completeBy);
        const notificationDate = new Date(completeDate);
        notificationDate.setDate(completeDate.getDate() - (item.notificationDaysBefore || 1));

        const timeRemaining = completeDate - now;
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        const taskTitle = now > completeDate ? 'Task Overdue!' : 'Task Due Soon!';
        const taskBody = now > completeDate 
          ? `The task "${item.title}" is overdue!` 
          : `The task "${item.title}" is due in ${daysRemaining > 0 
              ? `${daysRemaining} days` 
              : `${hoursRemaining} hours and ${minutesRemaining} minutes`}!`;
        
        
          this.showNotification(taskTitle, taskBody, showNotificationCallback, item.id);
          NotificationRepository.updateLastNotificationTime(item.id);              
      });    
  }

  static shouldSendNotification(task, currentTime = new Date()) {
    if (!task.enableNotifications || !task.completeBy) {
      return false;
    }

    const completeDate = new Date(task.completeBy);
    const isOverdue = currentTime > completeDate;    

    // For upcoming tasks
    const notificationDate = new Date(completeDate);
    notificationDate.setDate(completeDate.getDate() - (task.notificationDaysBefore || 1));
        
    if ((currentTime >= notificationDate && currentTime < completeDate) || isOverdue) {
      const lastNotification = NotificationRepository.getLastNotificationTime(task.id);
            
      if (!lastNotification) {
        return true;
      }

      const lastNotificationTime = new Date(lastNotification);
      const hoursSinceLastNotification = (currentTime - lastNotificationTime) / (1000 * 60 * 60);

      // Use the same notification frequency logic as overdue tasks
      switch (task.notificationFrequency) {
        case 'hourly':
          return hoursSinceLastNotification >= 1;
        case 'daily':
          return hoursSinceLastNotification >= 12; // Twice daily
        case 'weekly':
          return hoursSinceLastNotification >= 24; // Daily 
        default:
          return hoursSinceLastNotification >= 24; // Default to daily
      }
    }

    return false;
  }
  
  static showNotification(title, message, showNotificationCallback, taskId) {
    if (showNotificationCallback) {
      const severity = title.includes('Overdue') ? 'error' : 'warning';
      showNotificationCallback(`${title}: ${message}`, {
        severity,
        key: `task-notification-${taskId}`,
        autoHideDuration: 6000,
      });
    }
  }
}

export default NotificationOperations;

