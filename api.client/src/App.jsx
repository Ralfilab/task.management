import React, { useEffect } from "react";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { NotificationsProvider, useNotifications } from '@toolpad/core/useNotifications';
import { BoardContext, BoardProvider } from "./boards/contexts/BoardContext";
import TaskRepository from "./tasks/repositories/TaskRepository";
import NotificationOperations from "./notifications/operations/NotificationOperations";


const generateNavigation = (boards) => [
  {
    title: "Home",
    icon: <TaskAltOutlinedIcon />,
    segment: "",
  },
  {
    title: "Boards",
    segment: "boards",
    icon: <DashboardIcon />,
    children: boards.map((board) => ({
      title: board.title,
      segment: `${board.id}`,
    })),
  },
  {
    segment: "configuration",
    title: "Configuration",
    icon: <ImportExportIcon />,
  },
];

const BRANDING = {
  title: 'To-Do List',
};

function NavigationWrapper() {
  const { boards } = React.useContext(BoardContext);
  const notifications = useNotifications();
  
  useEffect(() => {        
    const checkTasks = () => {
      const tasks = TaskRepository.getTask();
      NotificationOperations.checkTaskDueDates(tasks, (message, options) => {
        notifications.show(message, options);
      });
    };
    
    checkTasks();

    // Set up periodic check every 10 minutes
    const intervalId = setInterval(checkTasks, 10 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [notifications]);

  return (
    <AppProvider navigation={generateNavigation(boards)} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}

export default function App() {

  return (
    <BoardProvider>
      <NotificationsProvider>
        <NavigationWrapper />
      </NotificationsProvider>
    </BoardProvider>
  );
}