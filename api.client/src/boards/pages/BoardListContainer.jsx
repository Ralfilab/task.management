import React, { useState, useContext } from 'react';
import BoardList from './BoardList';
import { BoardContext } from "../contexts/BoardContext";

const BoardListContainer = () => {  
  const { boards, addBoard, updateBoard, removeBoard, reorderBoards } = useContext(BoardContext);  

  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState('');  

  const [alertOpen, setAlertOpen] = useState(false);  

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleAddNewItem = () => {
    if (newItem.trim()) {
      addBoard(newItem);
      setNewItem('');      
    }

    setEditId(null);
  };

  const handleEditChange = (id, title) => {
    updateBoard(id, title);
    setEditId(null);
  };

  const handleDeleteItem = (id) => {
    removeBoard(id);
    setAlertOpen(true);
  };

  return (
    <>      
      <BoardList items={boards} editId={editId} setEditId={setEditId} newItem={newItem} setNewItem={setNewItem}
        alertOpen={alertOpen} handleAlertClose={handleAlertClose}
        handleAddNewItem={handleAddNewItem} handleEditChange={handleEditChange}
        handleDeleteItem={handleDeleteItem} reorderItems={reorderBoards} />    
    </>
  );
};

export default BoardListContainer;