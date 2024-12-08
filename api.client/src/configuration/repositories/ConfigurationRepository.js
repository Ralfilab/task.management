import TaskRepository from '../../tasks/repositories/TaskRepository';
import BoardRepository from '../../boards/repositories/BoardRepository';

class ConfigurationRepository {  
  static exportAllDataToFile() {    
    const tasks = TaskRepository.getTask();
    const boards = BoardRepository.get();

    const exportData = {
      defaultTasks: tasks,
      boards: boards,
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
    TaskRepository.save(data.defaultTasks);
    BoardRepository.save(data.boards);    
  }
}

export default ConfigurationRepository;