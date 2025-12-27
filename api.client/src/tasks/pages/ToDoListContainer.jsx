import React, { useState, useEffect, useRef } from 'react';
import ToDoList from './TodoList';
import TaskDetailsPopup from './TaskDetailsPopup';
import TaskRepository from '../repositories/TaskRepository'
import TaskOperations from '../operations/TaskOperations'
import { useParams } from "react-router-dom";
import BoardRepository from '../../boards/repositories/BoardRepository';

const ToDoListContainer = () => {  
  let { boardId } = useParams();  

  if(!boardId) {
    boardId = BoardRepository.getDefaultBoard().id;
  }

  const [items, setItems] = useState([]);

  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState('');  

  const [itemPopupId, setItemPopupId] = useState(null);  
  const [popupItem, setPopupItem] = useState(null);

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

  const handleAddNewItem = async (indexToInsert) => {
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
      await TaskRepository.mergeAndSave(newList);
      setNewItem('');
      setEditId(null);
    }
    else {
      setEditId(null);
    }
  };

  const handleEditChange = async (id, title) => {
    const newList = items.map(item => item.id === id ? { ...item, title, boards: [boardId] } : item);
    setItems(newList);
    await TaskRepository.mergeAndSave(newList);
    setEditId(null);
  };

  const handleDeleteItem = async (id) => {
    const newList = items.filter(item => item.id !== id);
    setItems(newList);
    await TaskRepository.delete(id);
    setAlertOpen(true);
  };

  const reorderItems = async (draggedIndex, index, items) => {
    if (draggedIndex !== index) {
      const reorderedItems = [...items];
      const [movedItem] = reorderedItems.splice(draggedIndex, 1);
      reorderedItems.splice(index, 0, movedItem);
      setItems(reorderedItems);
      await TaskRepository.mergeAndSave(reorderedItems);
    }
  }

  const openTaskDetailsPopup = async (id) => {
    setItemPopupId(id);
    const tasks = await TaskRepository.getTaskByBoardId(boardId);
    const item = tasks.find(x => x.id === id);
    if (item === null || item === undefined) {
      throw new Error(`Can not find an item for editing inside popup, id: ${id}`);
    }
    setPopupItem(item);
  }

  const itemPopupClose = () => {
    setItemPopupId(null);
    setPopupItem(null);
  }

  const loadTasks = async () => {    
    const tasks = await TaskRepository.getTaskByBoardId(boardId);
    setItems(tasks);    
  }

  return (
    <>      
      <ToDoList items={items} editId={editId} setEditId={setEditId} newItem={newItem} setNewItem={setNewItem}
        alertOpen={alertOpen} handleAlertClose={handleAlertClose}
        handleAddNewItem={handleAddNewItem} handleEditChange={handleEditChange}
        handleDeleteItem={handleDeleteItem} reorderItems={reorderItems}
        openTaskDetailsPopup={openTaskDetailsPopup} />
      {itemPopupId !== null && popupItem !== null && 
        <TaskDetailsPopup item={popupItem}
          handleClose={itemPopupClose} loadTasks={loadTasks} />
      }      
    </>
  );
};

export default ToDoListContainer;