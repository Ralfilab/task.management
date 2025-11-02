import React from 'react';
import { Button, Box, Typography, Paper, Stack, useTheme, useMediaQuery } from '@mui/material';
import { UploadFile, Download, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import ConfigurationRepository from '../repositories/ConfigurationRepository';

const ConfigurationContainer = () => {    
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  
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