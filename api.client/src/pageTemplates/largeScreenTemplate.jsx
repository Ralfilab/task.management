import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, ListItemIcon, CssBaseline, Box } from '@mui/material';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Link } from "react-router-dom";

const LargeScreenTemplate = ({ children }) => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#181329' }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            <img src="\wizard_logo_dark_background_small.jpg"></img>   
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton key="TasksButton" component={Link} to="/">
              <ListItemIcon>
                <TaskAltOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" />              
            </ListItemButton>
            <ListItemButton key="ConfigurationButton" component={Link} to="/config">
              <ListItemIcon>
                <ImportExportIcon />
              </ListItemIcon>
              <ListItemText primary="Configuration" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Toolbar />
        { children }      
      </Box>
    </Box>
  );
};

export default LargeScreenTemplate;