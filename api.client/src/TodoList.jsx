/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { TextField, List, ListItem, IconButton, Typography, Alert, Snackbar } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DetailsIcon from '@mui/icons-material/Details';

// Styles
const itemStyle = { marginBottom: 8, padding: 8, border: '1px solid #ddd', borderRadius: 4, display: 'flex', alignItems: 'center' };

const ToDoList = ({ items, editId, setEditId, newItem, setNewItem, alertOpen, handleAlertClose,
  handleAddNewItem, handleEditChange, handleDeleteItem, reorderItems, openTaskDetailsPopup }) => {  
  const listRef = useRef(null);  
    
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    reorderItems(draggedIndex, index, items);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
    <List ref={listRef}>
      <ListItem
        draggable
        onDragStart={(e) => handleDragStart(e, items.length)}
        onDrop={(e) => handleDrop(e, items.length)}
        onDragOver={handleDragOver}
        style={itemStyle}
      >
        {editId === 'add-new-top' ? (
          <TextField
            fullWidth            
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onBlur={() => handleAddNewItem(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNewItem(0);
            }}
          />
        ) : (
          <IconButton onClick={() => setEditId('add-new-top')}>
            <AddTaskIcon />
          </IconButton>
        )}
      </ListItem>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
          style={itemStyle}
        >
          <IconButton onClick={() => handleDeleteItem(item.id)}>
            <DoneIcon />
          </IconButton>
          {editId === item.id ? (
            <TextField
              autoFocus
              fullWidth
              defaultValue={item.title}
              onBlur={(e) => handleEditChange(item.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditChange(item.id, e.target.value);
              }}
            />
          ) : (
            <>
              <Typography sx={{ flexGrow: 1 }} variant="body1" onClick={() => setEditId(item.id)}>{item.title}</Typography>                                          
            </>
          )}
          <IconButton sx={{ justifyContent: "space-between" }} onClick={() => openTaskDetailsPopup(item.id)}>
            <DetailsIcon />
          </IconButton>
        </ListItem>
      ))}
      { items.length > 0 && (
        <ListItem
          draggable
          onDragStart={(e) => handleDragStart(e, items.length)}
          onDrop={(e) => handleDrop(e, items.length)}
          onDragOver={handleDragOver}
          style={itemStyle}
          >          
          {editId === 'add-new-bottom' ? (
            <TextField
              fullWidth
              autoFocus
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onBlur={() => handleAddNewItem(items.length)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNewItem(items.length);
              }}
            />
          ) : (            
                <IconButton onClick={() => setEditId('add-new-bottom')}>
              <AddTaskIcon />
            </IconButton>          
          )}
        </ListItem>
      )}
    </List>    

    <Snackbar
      open={alertOpen}
      autoHideDuration={3000}
      onClose={handleAlertClose}
    >
      <Alert onClose={handleAlertClose} severity="success">
        Well done you have just closed a task!
      </Alert>
    </Snackbar>
    </>
  );
};

export default ToDoList;
