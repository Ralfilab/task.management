import React, { useEffect, useRef, useCallback } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useDialogs } from '@toolpad/core/useDialogs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OllamaService from '../services/OllamaService';
import OllamaConfigurationRepository from '../repositories/OllamaConfigurationRepository';
import TaskRepository from '../../tasks/repositories/TaskRepository';

function TaskAdviceDialog({ open, onClose, payload }) {
  const advice = payload?.advice ?? '';

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={() => onClose()}>
      <DialogTitle>Task Management Advice</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ whiteSpace: 'pre-line' }}>
            {advice}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} autoFocus>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const OllamaIntegration = ({ boardId }) => {
  const notifications = useNotifications();
  const dialogs = useDialogs();
  const intervalRef = useRef(null);
  const isRunningRef = useRef(false);

  const checkAndGetAdvice = useCallback(async () => {
    // Prevent concurrent executions
    if (isRunningRef.current) {
      return;
    }

    if (!OllamaService.shouldRunCheck()) {
      return;
    }

    isRunningRef.current = true;

    try {
      // Get tasks for the current board
      const tasks = await TaskRepository.getTaskByBoardId(boardId);
      
      if (tasks.length === 0) {
        // No tasks to get advice on
        OllamaConfigurationRepository.updateLastRun();
        return;
      }

      const advice = await OllamaService.getTaskAdvice(tasks);
      
      // Update last run timestamp on success
      OllamaConfigurationRepository.updateLastRun();
      
      // Show custom dialog with advice
      await dialogs.open(TaskAdviceDialog, { advice });
    } catch (error) {
      // Show error notification
      notifications.show(`Ollama Error: ${error.message}`, {
        severity: 'error',
        autoHideDuration: 8000,
      });
    } finally {
      isRunningRef.current = false;
    }
  }, [boardId, notifications, dialogs]);

  useEffect(() => {
    // Initial check
    checkAndGetAdvice();

    // Set up interval to check every hour (3600000 ms)
    intervalRef.current = setInterval(() => {
      checkAndGetAdvice();
    }, 60 * 60 * 1000); // 1 hour

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndGetAdvice]); // Re-run when boardId or notifications change

  // This component doesn't render anything
  return null;
};

export default OllamaIntegration;
