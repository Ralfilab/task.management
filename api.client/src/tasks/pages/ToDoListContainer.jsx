import React, { useState, useEffect, useRef } from 'react';
import ToDoList from './TodoList';
import TaskDetailsPopup from './TaskDetailsPopup';
import TaskRepository from '../repositories/TaskRepository'
import TaskOperations from '../operations/TaskOperations'
import { useParams } from "react-router-dom";

// https://copilot.microsoft.com/shares/8XCoJ7tH5UAfWePjGLDrv

const ToDoListContainer = () => {  
  let { boardId } = useParams();  

  const [items, setItems] = useState([]);

  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState('');  

  const [itemPopupId, setItemPopupId] = useState(null);  

  const [alertOpen, setAlertOpen] = useState(false);  
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    loadTasks();
  }, [boardId]);
  
  // Keep notifications state in browser memory => once a day notification    

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleAddNewItem = (indexToInsert) => {
    if (newItem.trim()) {
      const newList = [...items];      
      const newTask = { 
        id: TaskOperations.generateUniqueId(), 
        title: newItem, 
        boards: [boardId],
        completeBy: null 
      };

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

  const getEditedItem = () => {
    const item = TaskRepository.getTaskByBoardId(boardId).find(x => x.id === itemPopupId);
    if (item === null) {
      throw new Error(`Can not find an item for editing inside popup, id: ${itemPopupId}`);
    }
    return item;
  };

  const openTaskDetailsPopup = (id) => {
    setItemPopupId(id);     
  }

  const itemPopupClose = () => {
    setItemPopupId(null);
  }

  const loadTasks = () => {    
    setItems(TaskRepository.getTaskByBoardId(boardId));    
  }

  return (
    <>      
      <ToDoList items={items} editId={editId} setEditId={setEditId} newItem={newItem} setNewItem={setNewItem}
        alertOpen={alertOpen} handleAlertClose={handleAlertClose}
        handleAddNewItem={handleAddNewItem} handleEditChange={handleEditChange}
        handleDeleteItem={handleDeleteItem} reorderItems={reorderItems}
        openTaskDetailsPopup={openTaskDetailsPopup} />
      {itemPopupId !== null && 
        <TaskDetailsPopup item={getEditedItem()}
          handleClose={itemPopupClose} loadTasks={loadTasks} />
      }      
    </>
  );
};

export default ToDoListContainer;