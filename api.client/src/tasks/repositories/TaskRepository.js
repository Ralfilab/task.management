import TaskOperations from '../operations/TaskOperations';

class TaskRepository {
  static storageKey = 'wickedToDoList';

  static getTask() {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) {
      const defaultTask = TaskOperations.getDefaultTasks();
      localStorage.setItem(this.storageKey, JSON.stringify(defaultTask));
      return defaultTask;
    }

    const initialValue = JSON.parse(saved);
    return initialValue;
  }

  static save(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  static mergeAndSave(items) {    
    const mergedItems = this.mergeArraysWithOrder(this.getTask(), items);
    this.save(mergedItems);    
  }

  static update(updateItem) {    
    const items = this.getTask();
    
    const newList = items.map(item => item.id === updateItem.id ? updateItem : item);
        
    this.save(newList);    
  }

  static get(id) {
    const tasks = this.getTask().filter(item => item.id === id);

    if (tasks.length !== 1) {
      throw new Error(`Number of tasks for task id ${id} is ${tasks.length}. Expected number is one.`);
    }

    return tasks[0];
  }

  static delete(id) {
    const newList = this.getTask().filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(newList));
  }

  static mergeArraysWithOrder(array1, array2) {
    // Step 1: Remove objects from array1 that have matching id in array2
    array1 = array1.filter(item1 => !array2.some(item2 => item2.id === item1.id));

    // Step 2: Add remaining elements from array1 to array2
    array2 = array2.concat(array1);

    return array2;
  }

  static deleteTasksByBoardId(boardId) {
    let items = this.getTask();

    items = items.filter(item => {
      return !item.boards || item.boards.length === 0 || !item.boards.includes(boardId)
    })

    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  static getTaskByBoardId(boardId) {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) {
      const defaultTask = TaskOperations.getDefaultTasks();
      localStorage.setItem(this.storageKey, JSON.stringify(defaultTask));
      return defaultTask;
    }

    const items = JSON.parse(saved);

    return items.filter(item => {            
      return !item.boards || item.boards.length === 0 || item.boards.includes(boardId)
    });    
  }  
}

export default TaskRepository;