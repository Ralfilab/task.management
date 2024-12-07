import React from 'react';
import { Button, Box } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import TaskRepository from '../../tasks/repositories/TaskRepository';

const ConfigurationContainer = () => {    
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        TaskRepository.importAllData(e.target.result);                
      };
      reader.readAsText(file);
    }
  };

  return (          
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          Select file to import data
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>      
        <Button
          component="label" onClick={() => TaskRepository.exportAllDataToFile()} >
          Export data
        </Button>
        <Button
          component={Link}
          to="/boards"
          variant="contained"
          color="primary"
        >
          Boards
        </Button>
      </Box>
    </>     
  );
};

export default ConfigurationContainer;