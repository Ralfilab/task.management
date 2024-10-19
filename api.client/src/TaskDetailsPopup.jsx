import React from 'react';
import {
  Dialog, 
  DialogContent,
  DialogTitle, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const TaskDetailsPopup = ({ open, title, description, setDescription, handleClose }) => {
    //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  //return (
  //  <div style={{ width: 500, height: 300 }}>
  //    <div ref={quillRef} />
  //  </div>
  //);

  return (
    <Dialog
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
        <ReactQuill theme="snow" value={description} onChange={setDescription} />
      </DialogContent>      
    </Dialog>    
  );
};

export default TaskDetailsPopup;