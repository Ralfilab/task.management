import React, { useState} from 'react';
import { Button, Box } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import ConfigurationRepository from '../repositories/ConfigurationRepository';
import BrowserNotificationOperations from '../../notifications/operations/BrowserNotificationOperations';
const ConfigurationContainer = () => {    
  
  const [browserNotificationPermission, setBrowserNotificationPermission] = 
    useState(BrowserNotificationOperations.isPermissionGranted());
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        ConfigurationRepository.importAllData(e.target.result);                
      };
      reader.readAsText(file);
    }
  };

  const setNotificationPermission = () => {
    setBrowserNotificationPermission(BrowserNotificationOperations.isPermissionGranted());
    setBrowserNotificationPermission(true);
  }

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
          component="label" onClick={() => ConfigurationRepository.exportAllDataToFile()} >
          Export data
        </Button>
        {!browserNotificationPermission && (
          <Button
            onClick={() => setNotificationPermission()} 
            variant="contained"
            color="primary"
            >
            Request browser notification access
          </Button>
        )}
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