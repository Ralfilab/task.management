import React, { useState } from 'react';
import ToDoList from './ToDoList';

const ToDoListContainer = () => {
  const storageKey = "wickedToDoList";

  const getLocalStorageList = () => {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      return [{ id: '1', title: 'Sample Item' }];
    }

    const initialValue = JSON.parse(saved);
    return initialValue;
  };

  const [items, setItems] = useState(() => getLocalStorageList());

  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);  

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const generateUniqueId = () => Date.now() + Math.random().toString(36).substr(2, 9);

  const handleAddNewItem = (indexToInsert) => {
    if (newItem.trim()) {
      const newList = [...items];

      const newTask = { id: generateUniqueId(), title: newItem };

      newList.splice(indexToInsert, 0, newTask);

      setItems(newList);
      localStorage.setItem(storageKey, JSON.stringify(newList));
      setNewItem('');
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

  return <ToDoList items={items} editId={editId} setEditId={setEditId} newItem={newItem} setNewItem={setNewItem}
    alertOpen={alertOpen} handleAlertClose={handleAlertClose}
    handleAddNewItem={handleAddNewItem} handleEditChange={handleEditChange}
    handleDeleteItem={handleDeleteItem} reorderItems={reorderItems} />
};

export default ToDoListContainer;