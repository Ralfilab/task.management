import React from 'react';
import {
  Dialog, 
  DialogContent,
  DialogTitle, IconButton,
  useMediaQuery, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


const TaskDetailsPopup = ({ open, title, description, setDescription, handleClose }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));  

  return (
    <Dialog
      fullScreen={isSmallScreen}
      fullWidth
      maxWidth="md"      
      open={open}
      onClose={handleClose}      
    >
      <DialogTitle>        
        {title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>        
        <ReactQuill style={{ height: '95%', width: '100%' }}
            theme="snow" value={description} onChange={setDescription} />        
      </DialogContent>      
    </Dialog>    
  );
};

export default TaskDetailsPopup;