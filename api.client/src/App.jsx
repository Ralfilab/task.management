import React from "react";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { BoardContext, BoardProvider } from "./boards/contexts/BoardContext";

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
  return (
    <BoardProvider>
      <NavigationWrapper />
    </BoardProvider>
  );
}