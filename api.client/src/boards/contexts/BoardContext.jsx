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

  const removeBoard = (id) => {
    setItems((prevBoards) => {
      const newItems = prevBoards.filter((board) => board.id !== id);
      BoardRepository.save(newItems);
      TaskRepository.deleteTasksByBoardId(id);
      return newItems;
    }); 
  };  

  return (
    <BoardContext.Provider value={{ boards: items, addBoard, updateBoard, removeBoard, import: setItems  }}>
      {children}
    </BoardContext.Provider>
  );
};