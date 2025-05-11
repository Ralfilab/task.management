import BrowserNotificationRepository from '../repositories/BrowserNotificationRepository';

class BrowserNotificationOperations {  
  static async requestPermission() {
    try {      
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  static checkTaskDueDates(items) {
    if (this.isPermissionGranted()) {
      const now = new Date();      
    
      items.forEach(item => {
        if (!item.enableNotifications || !item.completeBy) {
          return;
        }

        const completeDate = new Date(item.completeBy);
        const notificationDate = new Date(completeDate);
        notificationDate.setDate(completeDate.getDate() - (item.notificationDaysBefore || 1));

        const taskTitle = now > completeDate ? 'Task Overdue!' : 'Task Due Soon!';
        const taskBody = now > completeDate ? `The task "${item.title}" is overdue!` : `The task "${item.title}" is due in ${item.notificationDaysBefore} days!`;
        
        if (BrowserNotificationRepository.shouldSendNotification(item)) {
          this.showNotification(taskTitle, {
            body: taskBody,
            icon: '/path-to-your-icon.png',
            tag: `overdue-${item.id}`,
            requireInteraction: true
          });
          BrowserNotificationRepository.updateLastNotificationTime(item.id);
        }        
      });
    }
  }

  static isPermissionGranted() {
    return Notification.permission === 'granted';
  }

  static showNotification(title, options) {
    console.log('Attempting to show notification:', title);
    if (this.isPermissionGranted()) {
      try {
        new Notification(title, options);
        console.log('Notification shown successfully');
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    } else {
      console.log('Notification permission not granted');
    }
  }    
}

export default BrowserNotificationOperations;