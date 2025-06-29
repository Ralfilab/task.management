/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { TextField, List, ListItem, IconButton, Typography, Alert, Snackbar, useTheme } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';

const ToDoList = ({ items, editId, setEditId, newItem, setNewItem,
  handleAddNewItem, handleEditChange, handleDeleteClick, handleLinkClick, reorderItems }) => {  
  const listRef = useRef(null);
  const theme = useTheme();
    
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

  const itemStyle = (completeBy) => {
    const now = new Date();
    const completeDate = completeBy ? new Date(completeBy) : null;
    const threeDaysBefore = completeDate ? new Date(completeDate) : null;
    if (threeDaysBefore) {
      threeDaysBefore.setDate(completeDate.getDate() - 3);
    }

    let bgColor = 'inherit';
    if (completeDate && now > completeDate) {
      bgColor = theme.palette.error.light;
    } else if (threeDaysBefore && now > threeDaysBefore) {
      bgColor = theme.palette.warning.light;
    }

    return {
      marginBottom: 8,
      padding: 8,
      border: '1px solid #ddd',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: bgColor,
      '&:hover': {
        opacity: 0.9
      }
    };
  };

  return (
    <>    
    <List ref={listRef}>      
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
          style={itemStyle(item.completeBy)}
        >          
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
              <Typography sx={{ flexGrow: 1 }} variant="body1" onClick={() => setEditId(item.id)}>
                {item.title}
                {item.completeBy && (
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    Complete by: {new Date(item.completeBy).toLocaleString(undefined, { 
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                )}
              </Typography>                                          
            </>
          )}
          <IconButton sx={{ justifyContent: "space-between" }} onClick={() => handleLinkClick(item)}>
            <ExitToAppIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(item)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
      { items.length > 0 && (
        <ListItem
          key="add-new-bottom"
          draggable
          onDragStart={(e) => handleDragStart(e, items.length)}
          onDrop={(e) => handleDrop(e, items.length)}
          onDragOver={handleDragOver}
          style={itemStyle(theme)}
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
    </>
  );
};

export default ToDoList;
