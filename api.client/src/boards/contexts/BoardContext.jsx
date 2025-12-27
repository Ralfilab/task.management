import React, { createContext, useState } from "react";
import BoardRepository from '../repositories/BoardRepository'
import BoardOperations from '../operations/BoardOperations'
import TaskRepository from '../../tasks/repositories/TaskRepository'

export const BoardContext = createContext();

const boards = BoardRepository.get();

export const BoardProvider = ({ children }) => {
  const [items, setItems] = useState(boards);

  const addBoard = (title) => {
    const newItem = { id: BoardOperations.generateUniqueId(), title: title };
    const newItems = [...items, newItem];    
    setItems(newItems);    
    BoardRepository.save(newItems);
    return newItem;
  };

  const updateBoard = (id, updatedTitle) => {
    setItems((prevBoards) => {
      const newItems = prevBoards.map((board) =>
        board.id === id ? { ...board, title: updatedTitle } : board
      )
      BoardRepository.save(newItems); 
      return newItems;
    });
  };

  const removeBoard = async (id) => {
    setItems((prevBoards) => {
      const newItems = prevBoards.filter((board) => board.id !== id);
      BoardRepository.save(newItems);
      TaskRepository.deleteTasksByBoardId(id).catch(err => console.error('Error deleting tasks by board id:', err));
      return newItems;
    }); 
  };  

  const reorderBoards = (draggedIndex, index, items) => {
    if (draggedIndex !== index) {
      const reorderedItems = [...items];
      const [movedItem] = reorderedItems.splice(draggedIndex, 1);
      reorderedItems.splice(index, 0, movedItem);
      setItems(reorderedItems);
      BoardRepository.save(reorderedItems);      
    }
  }

  return (
    <BoardContext.Provider value={{ boards: items, addBoard, updateBoard, removeBoard, reorderBoards, import: setItems  }}>
      {children}
    </BoardContext.Provider>
  );
};