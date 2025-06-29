import React, { useState, useContext } from 'react';
import BoardList from './BoardList';
import { useNavigate } from "react-router-dom";
import { BoardContext } from "../contexts/BoardContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const BoardListContainer = () => {  
  const { boards, addBoard, updateBoard, removeBoard, reorderBoards } = useContext(BoardContext);  
  const navigate = useNavigate();

  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState('');  

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      handleDeleteItem(itemToDelete.id);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleLinkClick = (item) => {
    navigate(`/boards/${item.id}`);
  };

  return (
    <>      
      <BoardList items={boards} editId={editId} setEditId={setEditId} newItem={newItem} setNewItem={setNewItem}
        handleAddNewItem={handleAddNewItem} handleEditChange={handleEditChange} handleLinkClick={handleLinkClick}
        handleDeleteClick={handleDeleteClick} reorderItems={reorderBoards} />    

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoardListContainer;