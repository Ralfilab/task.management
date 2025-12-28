import TaskOperations from '../operations/TaskOperations';

class TaskRepository {
  static storageKey = 'wickedToDoList';
  // Promise-based lock to prevent concurrent initialization
  static _initializationPromise = null;

  static async getTask() {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) {
      // If initialization is already in progress, wait for it
      if (this._initializationPromise) {
        return await this._initializationPromise;
      }

      // Start initialization and store the promise
      this._initializationPromise = (async () => {
        try {
          const defaultTask = await TaskOperations.getDefaultTasks();
          localStorage.setItem(this.storageKey, JSON.stringify(defaultTask));
          return defaultTask;
        } finally {
          // Clear the promise after initialization completes
          this._initializationPromise = null;
        }
      })();

      return await this._initializationPromise;
    }

    const initialValue = JSON.parse(saved);
    return initialValue;
  }

  static save(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  static async mergeAndSave(items) {    
    const allTasks = await this.getTask();
    const mergedItems = this.mergeArraysWithOrder(allTasks, items);
    this.save(mergedItems);    
  }

  static async update(updateItem) {    
    const items = await this.getTask();
    
    const newList = items.map(item => item.id === updateItem.id ? updateItem : item);
        
    this.save(newList);    
  }

  static async get(id) {
    const tasks = (await this.getTask()).filter(item => item.id === id);

    if (tasks.length !== 1) {
      throw new Error(`Number of tasks for task id ${id} is ${tasks.length}. Expected number is one.`);
    }

    return tasks[0];
  }

  static async delete(id) {
    const allTasks = await this.getTask();
    const newList = allTasks.filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(newList));
  }

  static mergeArraysWithOrder(array1, array2) {
    // Step 1: Remove objects from array1 that have matching id in array2
    array1 = array1.filter(item1 => !array2.some(item2 => item2.id === item1.id));

    // Step 2: Add remaining elements from array1 to array2
    array2 = array2.concat(array1);

    return array2;
  }

  static async deleteTasksByBoardId(boardId) {
    let items = await this.getTask();

    items = items.filter(item => {
      return !item.boards || item.boards.length === 0 || !item.boards.includes(boardId)
    })

    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  static async getTaskByBoardId(boardId) {
    // Use getTask() to ensure initialization happens only once
    const items = await this.getTask();

    return items.filter(item => {            
      return !item.boards || item.boards.length === 0 || item.boards.includes(boardId)
    });    
  }  
}

export default TaskRepository;