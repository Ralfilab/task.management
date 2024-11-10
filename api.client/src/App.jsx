import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Box, useMediaQuery, useTheme } from '@mui/material';
import { Home, Info, ContactMail } from '@mui/icons-material';
import ToDoListContainer from './ToDoListContainer';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';

const drawerWidth = 240;

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

const App = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const SmallScreenApp = () => {
    return (
      <React.Fragment>
        <CssBaseline />
        <Paper square sx={{ pb: '50px' }}>
          <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
            Inbox
          </Typography>
          <ToDoListContainer />
        </Paper>
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <StyledFab color="secondary" aria-label="add">
              <AddIcon />
            </StyledFab>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }

  const LargeScreenApp = () => {
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
              {['Home', 'About', 'Contact'].map((text, index) => (
                <ListItemButton key={ text } component="a" onClick={() => alert('List item clicked!')}>
                  <ListItemIcon>
                    {index === 0 ? <Home /> : index === 1 ? <Info /> : <ContactMail />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <ToDoListContainer />  
        </Box>
      </Box>
    );
  }

  return (
    isSmallScreen ? SmallScreenApp() : LargeScreenApp()
  );
};

export default App;