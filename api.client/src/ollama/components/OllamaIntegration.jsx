import React, { useEffect, useRef, useCallback } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import OllamaService from '../services/OllamaService';
import OllamaConfigurationRepository from '../repositories/OllamaConfigurationRepository';
import TaskRepository from '../../tasks/repositories/TaskRepository';

const OllamaIntegration = ({ boardId }) => {
  const notifications = useNotifications();
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
      
      // Show notification with advice
      notifications.show(`Task Management Advice: ${advice}`, {
        severity: 'info',
        autoHideDuration: 30000,
      });
    } catch (error) {
      // Show error notification
      notifications.show(`Ollama Error: ${error.message}`, {
        severity: 'error',
        autoHideDuration: 8000,
      });
    } finally {
      isRunningRef.current = false;
    }
  }, [boardId, notifications]);

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
