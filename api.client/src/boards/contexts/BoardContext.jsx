import React, { createContext, useState } from "react";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);

  const addBoard = (board) => {
    setBoards((prevBoards) => [...prevBoards, board]);
  };

  const updateBoard = (id, updatedTitle) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === id ? { ...board, title: updatedTitle } : board
      )
    );
  };

  const removeBoard = (id) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
  };

  return (
    <BoardContext.Provider value={{ boards, addBoard, updateBoard, removeBoard }}>
      {children}
    </BoardContext.Provider>
  );
};