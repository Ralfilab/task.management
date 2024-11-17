import * as React from 'react';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';

const NAVIGATION = [  
  {
    title: 'Home',
    icon: <TaskAltOutlinedIcon />,
  },
  {
    segment: 'configuration',
    title: 'Configuration',
    icon: <ImportExportIcon />,
  },
];

const BRANDING = {
  title: 'To-Do List',
};

export default function App() {
  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}
