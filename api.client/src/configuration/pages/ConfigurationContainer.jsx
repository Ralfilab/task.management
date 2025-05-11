import React, { useState} from 'react';
import { Button, Box, Typography, Paper, Stack, useTheme, useMediaQuery } from '@mui/material';
import { UploadFile, Download, Notifications, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import ConfigurationRepository from '../repositories/ConfigurationRepository';
import BrowserNotificationOperations from '../../notifications/operations/BrowserNotificationOperations';

const ConfigurationContainer = () => {    
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    BrowserNotificationOperations.requestPermission() ;
    setBrowserNotificationPermission(true);
  }

  return (          
    <Box sx={{ 
      width: '100%', 
      maxWidth: 600, 
      mx: 'auto', 
      p: { xs: 2, sm: 4 },
      boxSizing: 'border-box'
    }}>      
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Import or export your configuration data to backup or transfer settings between devices.
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFile />}
            fullWidth={isMobile}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          >
            Import Data
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => ConfigurationRepository.exportAllDataToFile()}
            fullWidth={isMobile}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          >
            Export Data
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Enable browser notifications to stay updated with important alerts and reminders.
        </Typography>
        {browserNotificationPermission ? (
          <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications fontSize="small" />
            Notifications are enabled
          </Typography>
        ) : (
          <Button
            onClick={() => setNotificationPermission()}
            variant="contained"
            color="primary"
            startIcon={<Notifications />}
            fullWidth={isMobile}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          >
            Enable Notifications
          </Button>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom>
          Navigation
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Access your boards and manage your tasks.
        </Typography>
        <Button
          component={Link}
          to="/boards"
          variant="contained"
          color="primary"
          startIcon={<Dashboard />}
          fullWidth={isMobile}
          sx={{ minWidth: { xs: '100%', sm: 200 } }}
        >
          Go to Boards
        </Button>
      </Paper>
    </Box>     
  );
};

export default ConfigurationContainer;