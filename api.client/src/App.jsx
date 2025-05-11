import React, { useEffect } from "react";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { BoardContext, BoardProvider } from "./boards/contexts/BoardContext";
import TaskRepository from "./tasks/repositories/TaskRepository";
import BrowserNotificationOperations from "./notifications/operations/BrowserNotificationOperations";

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
  return (
    <AppProvider navigation={generateNavigation(boards)} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}

export default function App() {
  useEffect(() => {        
    const checkTasks = () => {
      const tasks = TaskRepository.getTask();
      BrowserNotificationOperations.checkTaskDueDates(tasks);
    };
    
    checkTasks();

    // Set up periodic check every 10 minutes
    const intervalId = setInterval(checkTasks, 10 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <BoardProvider>
      <NavigationWrapper />
    </BoardProvider>
  );
}