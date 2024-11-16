import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import ToDoListContainer from './ToDoListContainer';
import ConfigurationContainer from './configuration/ConfigurationContainer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmallScreenApp from './pageTemplates/smallScreenTemplate';
import LargeScreenApp from './pageTemplates/largeScreenTemplate';

const App = () => {  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Router future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }}>
      {isSmallScreen ? (
        <SmallScreenApp>
          <Routes>
            <Route path="/*" element={<ToDoListContainer />} />
            <Route path="/config" element={<ConfigurationContainer />} />
          </Routes>
        </SmallScreenApp>
      ) : (
          <LargeScreenApp>
            <Routes>              
              <Route path="/*" element={<ToDoListContainer />} />              
              <Route path="/config" element={<ConfigurationContainer />} />
            </Routes>
          </LargeScreenApp>
      )}
    </Router>
  );
}

export default App;