import React, { useState } from 'react';
import {
  Button, Typography, Box, Dialog,
  DialogContent,
  DialogTitle, IconButton,
  useMediaQuery, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UploadFile } from '@mui/icons-material';

import TaskRepository from '../tasks/TaskRepository';

const ConfigurationPopupContainer = ({ open, handleClose }) => {  
  const [fileContent, setFileContent] = useState('');  

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog
      fullScreen={isSmallScreen}
      fullWidth
      maxWidth="md"      
      open={open}
      onClose={handleClose}      
    >
      <DialogTitle>        
        Import / Export All Data
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFile />}
          >
            Select File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {fileContent && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', width: '100%', maxWidth: '600px' }}>
              <Typography variant="h6">File Content:</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {fileContent}
              </Typography>
            </Box>
          )}
          <Button
            component="label" onClick={() => TaskRepository.exportAllDataToFile()} >
            Export
          </Button>
        </Box>
      </DialogContent>
    </Dialog>     
  );
};

export default ConfigurationPopupContainer;