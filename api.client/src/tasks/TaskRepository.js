import TaskOperations from './TaskOperations';

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

    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);    
  }
}

export default TaskRepository;