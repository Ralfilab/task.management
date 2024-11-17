import TaskOperations from '../operations/TaskOperations';

class TaskRepository {
  static storageKey = 'wickedToDoList';

  static getTask() {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) {
      const defaultTask = TaskOperations.addDefaultTasks();
      localStorage.setItem(this.storageKey, JSON.stringify(defaultTask));
      return defaultTask;
    }

    const initialValue = JSON.parse(saved);
    return initialValue;
  }  

  static exportAllDataToFile() {    
    const tasks = this.getTask();

    const exportData = {
      defaultTasks: tasks,
      configuration: {}
    }

    const jsonData = JSON.stringify(exportData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const now = new Date();
    const formattedDate = now.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/[^\d]/g, '-');

    a.download = `todo-list-export-${formattedDate}.json`;    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);    
  }

  static importAllData(stringData)
  {
    const data = JSON.parse(stringData);
    localStorage.setItem(this.storageKey, JSON.stringify(data.defaultTasks));
  }
}

export default TaskRepository;