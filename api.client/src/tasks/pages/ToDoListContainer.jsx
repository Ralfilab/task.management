import React, { useState } from 'react';
import ToDoList from './TodoList';
import TaskDetailsPopup from './TaskDetailsPopup';
import TaskRepository from '../repositories/TaskRepository'
import TaskOperations from '../operations/TaskOperations'

const ToDoListContainer = () => {
  const storageKey = "wickedToDoList";  

  const [items, setItems] = useState(() => TaskRepository.getTask());

  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState('');

  const [itemPopupId, setItemPopupId] = useState(null);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [itemPopupTitle, setItemPopupTitle] = useState(null);
  const [itemPopupDescription, setItemPopupDescription] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);  

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleAddNewItem = (indexToInsert) => {
    if (newItem.trim()) {
      const newList = [...items];

      const newTask = { id: TaskOperations.generateUniqueId(), title: newItem };

      newList.splice(indexToInsert, 0, newTask);

      setItems(newList);
      localStorage.setItem(storageKey, JSON.stringify(newList));
      setNewItem('');
      setEditId(null);
    }
    else {
      setEditId(null);
    }
  };

  const handleEditChange = (id, title) => {
    const newList = items.map(item => item.id === id ? { ...item, title } : item);
    setItems(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
    setEditId(null);
  };

  const handleDeleteItem = (id) => {
    const newList = items.filter(item => item.id !== id);
    setItems(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
    setAlertOpen(true);
  };

  const reorderItems = (draggedIndex, index, items) => {
    if (draggedIndex !== index) {
      const reorderedItems = [...items];
      const [movedItem] = reorderedItems.splice(draggedIndex, 1);
      reorderedItems.splice(index, 0, movedItem);
      setItems(reorderedItems);
      localStorage.setItem(storageKey, JSON.stringify(reorderedItems));
    }
  }

  const openTaskDetailsPopup = (id) => {    
    const item = TaskRepository.getTask().find(x => x.id === id);

    if (item === null) {
      throw `Item with id: ${id} not found!`;
    }

    setItemPopupOpen(true);
    setItemPopupId(id);
    setItemPopupTitle(item.title);
    setItemPopupDescription(item.description);
  }

  const itemPopupHandleClose = () => {
    const items = TaskRepository.getTask();
    const item = items.find(x => x.id === itemPopupId);
    item.description = itemPopupDescription;    
    localStorage.setItem(storageKey, JSON.stringify(items));

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