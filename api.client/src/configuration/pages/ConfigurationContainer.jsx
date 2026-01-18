import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Stack, useTheme, useMediaQuery, Divider, TextField, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { UploadFile, Download, Dashboard, Info, SmartToy } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useNotifications } from '@toolpad/core/useNotifications';

import ConfigurationRepository from '../repositories/ConfigurationRepository';
import OllamaConfigurationRepository from '../../ollama/repositories/OllamaConfigurationRepository';
import OllamaService from '../../ollama/services/OllamaService';
import TaskRepository from '../../tasks/repositories/TaskRepository';
import packageJson from '../../../package.json';

const ConfigurationContainer = () => {    
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const notifications = useNotifications();
  
  const [ollamaConfig, setOllamaConfig] = useState(() => OllamaConfigurationRepository.get());
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Reload config when it changes
    setOllamaConfig(OllamaConfigurationRepository.get());
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        ConfigurationRepository.importAllData(e.target.result);
        // Reload Ollama config after import
        setOllamaConfig(OllamaConfigurationRepository.get());
      };
      reader.readAsText(file);
    }
  };

  const handleOllamaConfigChange = (field, value) => {
    const newConfig = { ...ollamaConfig, [field]: value };
    OllamaConfigurationRepository.save(newConfig);
    setOllamaConfig(newConfig);
    setConnectionError(null);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionError(null);

    try {
      // Get a sample task to test with
      const tasks = await TaskRepository.getTask();
      const testTasks = tasks.slice(0, 3); // Use first 3 tasks for testing
      
      if (testTasks.length === 0) {
        // Create a dummy task for testing
        const dummyTasks = [{ id: 'test', title: 'Test task', completeBy: null }];
        await OllamaService.getTaskAdvice(dummyTasks);
      } else {
        await OllamaService.getTaskAdvice(testTasks);
      }

      notifications.show('Successfully connected to Ollama!', {
        severity: 'success',
        autoHideDuration: 5000,
      });
    } catch (error) {
      const errorMessage = error.message || 'Failed to connect to Ollama';
      setConnectionError(errorMessage);
      notifications.show(`Ollama Connection Error: ${errorMessage}`, {
        severity: 'error',
        autoHideDuration: 8000,
      });
    } finally {
      setTestingConnection(false);
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
            onClick={async () => await ConfigurationRepository.exportAllDataToFile()}
            fullWidth={isMobile}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          >
            Export Data
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy fontSize="small" />
          Ollama AI Integration
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Enable AI-powered task management suggestions using Ollama. The system will periodically analyze your tasks and provide advice.
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Important:</strong> To access local Ollama from this website, you must enable CORS in Ollama. 
            Otherwise, you will get a CORS error.
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>
                <Typography variant="body2" component="span">
                  Read the documentation:{' '}
                  <a 
                    href="https://docs.ollama.com/faq#how-can-i-allow-additional-web-origins-to-access-ollama" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    How to allow additional web origins
                  </a>
                </Typography>
              </li>
              <li>
                <Typography variant="body2" component="span">
                  Or run this PowerShell command (Windows):{' '}
                  <Box component="code" sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', px: 0.5, borderRadius: 0.5, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    $env:OLLAMA_ORIGINS="https://localtasklist.com"
                  </Box>
                </Typography>
              </li>
            </Box>
          </Typography>
        </Alert>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={ollamaConfig.enabled || false}
                onChange={(e) => handleOllamaConfigChange('enabled', e.target.checked)}
              />
            }
            label="Enable Ollama Integration"
          />
          
          {ollamaConfig.enabled && (
            <>
              <TextField
                fullWidth
                label="Ollama Base URL"
                value={ollamaConfig.baseUrl || 'http://localhost:11434'}
                onChange={(e) => handleOllamaConfigChange('baseUrl', e.target.value)}
                helperText="The URL where Ollama is running (default: http://localhost:11434)"
                disabled={testingConnection}
              />
              
              <TextField
                fullWidth
                label="Model Name"
                value={ollamaConfig.model || 'gemma3:1b'}
                onChange={(e) => handleOllamaConfigChange('model', e.target.value)}
                helperText="The Ollama model to use (default: gemma3:1b)"
                disabled={testingConnection}
              />

              {ollamaConfig.lastRun && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last advice check:
                  </Typography>
                  <Typography variant="body2">
                    {new Date(ollamaConfig.lastRun).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {connectionError && (
                <Alert severity="error" onClose={() => setConnectionError(null)}>
                  {connectionError}
                </Alert>
              )}

              <Button
                variant="outlined"
                onClick={handleTestConnection}
                disabled={testingConnection}
                fullWidth={isMobile}
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              >
                {testingConnection ? 'Testing Connection...' : 'Test Connection'}
              </Button>
            </>
          )}
        </Stack>
      </Paper>      

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
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

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info fontSize="small" />
          About
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Application Version
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {packageJson.version}
            </Typography>
          </Box>          
        </Stack>
      </Paper>
    </Box>     
  );
};

export default ConfigurationContainer;