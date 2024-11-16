import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

import TaskRepository from '../tasks/TaskRepository';

const ConfigurationContainer = () => {  
  const [fileContent, setFileContent] = useState('');  

  /*const theme = useTheme();*/
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));  

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
  );
};

export default ConfigurationContainer;