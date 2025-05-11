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
        if (item.completeBy) {
          const completeDate = new Date(item.completeBy);
          const threeDaysBefore = new Date(completeDate);
          threeDaysBefore.setDate(completeDate.getDate() - 3);

          if (now > completeDate) {
            this.showNotification('Task Overdue!', {
              body: `The task "${item.title}" is overdue!`,
              icon: '/path-to-your-icon.png',
              tag: `overdue-${item.id}`,
              requireInteraction: true
            });
          } else if (now > threeDaysBefore) {
            this.showNotification('Task Due Soon!', {
              body: `The task "${item.title}" is due in less than 3 days!`,
              icon: '/path-to-your-icon.png',
              tag: `due-soon-${item.id}`,
              requireInteraction: true
            });
          }
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