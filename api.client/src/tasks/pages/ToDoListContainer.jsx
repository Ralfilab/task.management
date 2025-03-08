import React, { useState, useEffect } from 'react';
import ToDoList from './TodoList';
import TaskDetailsPopup from './TaskDetailsPopup';
import TaskRepository from '../repositories/TaskRepository'
import TaskOperations from '../operations/TaskOperations'
import { useParams } from "react-router-dom";

const ToDoListContainer = () => {  
  let { boardId } = useParams();  

  const [items, setItems] = useState([]);

  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState('');

  const [itemPopupId, setItemPopupId] = useState(null);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [itemPopupTitle, setItemPopupTitle] = useState(null);
  const [itemPopupDescription, setItemPopupDescription] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);  

  useEffect(() => {
    setItems(TaskRepository.getTaskByBoardId(boardId));
  }, [boardId]);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleAddNewItem = (indexToInsert) => {
    if (newItem.trim()) {
      const newList = [...items];      
      const newTask = { id: TaskOperations.generateUniqueId(), title: newItem, boards: [boardId] };

      newList.splice(indexToInsert, 0, newTask);

      setItems(newList);
      TaskRepository.mergeAndSave(newList);
      setNewItem('');
      setEditId(null);
    }
    else {
      setEditId(null);
    }
  };

  const handleEditChange = (id, title) => {
    const newList = items.map(item => item.id === id ? { ...item, title, boards: [boardId] } : item);
    setItems(newList);
    TaskRepository.mergeAndSave(newList);
    setEditId(null);
  };

  const handleDeleteItem = (id) => {
    const newList = items.filter(item => item.id !== id);
    setItems(newList);
    TaskRepository.delete(id);
    setAlertOpen(true);
  };

  const reorderItems = (draggedIndex, index, items) => {
    if (draggedIndex !== index) {
      const reorderedItems = [...items];
      const [movedItem] = reorderedItems.splice(draggedIndex, 1);
      reorderedItems.splice(index, 0, movedItem);
      setItems(reorderedItems);
      TaskRepository.mergeAndSave(reorderedItems);
    }
  }

  const openTaskDetailsPopup = (id) => {    
    const item = TaskRepository.getTaskByBoardId(boardId).find(x => x.id === id);

    if (item === null) {
      throw `Item with id: ${id} not found!`;
    }

    setItemPopupOpen(true);
    setItemPopupId(id);
    setItemPopupTitle(item.title);
    setItemPopupDescription(item.description);
  }

  const itemPopupHandleClose = () => {
    const items = TaskRepository.getTaskByBoardId(boardId);
    const item = items.find(x => x.id === itemPopupId);
    item.description = itemPopupDescription;    
    TaskRepository.mergeAndSave(items);

    setItemPopupId(null);
    setItemPopupOpen(false);
    setItemPopupTitle(null);
    setItemPopupDescription(null);
  }

  return (
    <>
      <ToDoList items={items} editId={editId} setEditId={setEditId} newItem={newItem} setNewItem={setNewItem}
        alertOpen={alertOpen} handleAlertClose={handleAlertClose}
        handleAddNewItem={handleAddNewItem} handleEditChange={handleEditChange}
        handleDeleteItem={handleDeleteItem} reorderItems={reorderItems}
        openTaskDetailsPopup={openTaskDetailsPopup} />

      <TaskDetailsPopup open={itemPopupOpen} title={itemPopupTitle}
        description={itemPopupDescription} setDescription={setItemPopupDescription} handleClose={ itemPopupHandleClose } />     
    </>
  );
};

export default ToDoListContainer;