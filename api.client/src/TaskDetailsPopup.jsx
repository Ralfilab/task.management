import React from 'react';
import {
  Dialog, useMediaQuery, useTheme,
  DialogContent, DialogContentText,
  DialogTitle, TextareaAutosize
} from '@mui/material';

const TaskDetailsPopup = ({ open, title, description }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  //const modalStyle = {
  //  position: 'absolute',
  //  top: '50%',
  //  left: isMobile ? '50%' : '70%',
  //  transform: 'translate(-50%, -50%)',
  //  width: isMobile ? '100%' : '30%',
  //  height: isMobile ? '100%' : 'auto',
  //  bgcolor: 'background.paper',
  //  boxShadow: 24,
  //  p: 4,
  //};

  const handleClose = () => { };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>        
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextareaAutosize>
            {description}             
          </TextareaAutosize>          
        </DialogContentText>        
      </DialogContent>      
    </Dialog>    
  );
};

export default TaskDetailsPopup;