import BoardOperations from '../operations/BoardOperations';

class BoardRepository {
  static storageKey = 'wickedBoardList';

  static get() {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) {
      const items = BoardOperations.getDefaultBoards();
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return items;
    }

    const initialValue = JSON.parse(saved);
    return initialValue;
  } 
  
  static save(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}

export default BoardRepository;