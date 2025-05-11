import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,    
  Box,
  FormHelperText,
  Button,
  Checkbox,
  ListItemText,
  TextField,
  FormControlLabel
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { BoardContext } from '../../boards/contexts/BoardContext';
import TaskRepository from '../repositories/TaskRepository'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TaskDetailsPopup = ({ item, handleClose, loadTasks }) => {  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { boards } = React.useContext(BoardContext);
  const [description, setDescription] = useState(item.description);
  const [boardsError, setBoardsError] = useState(false);
  const [selectedBoards, setSelectedBoards] = useState(item.boards);
  const [completeBy, setCompleteBy] = useState(item.completeBy ? new Date(item.completeBy) : null);
  const [enableNotifications, setEnableNotifications] = useState(item.enableNotifications || false);
  const [notificationFrequency, setNotificationFrequency] = useState(item.notificationFrequency || 'daily');
  const [notificationDaysBefore, setNotificationDaysBefore] = useState(item.notificationDaysBefore || 1);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedBoards(typeof value === 'string' ? value.split(',') : value);
    setBoardsError(value.length === 0);
  }; 

  const handleSave = (id) => {
    if (selectedBoards.length === 0) {
      setBoardsError(true);
      return;
    }

    var item = TaskRepository.get(id);
    item.boards = selectedBoards;
    item.description = description;
    item.completeBy = completeBy;
    item.enableNotifications = enableNotifications;
    item.notificationFrequency = notificationFrequency;
    item.notificationDaysBefore = notificationDaysBefore;

    TaskRepository.update(item);

    handleClose();

    loadTasks();
  };

  return (
    <Dialog
      fullScreen={isSmallScreen}
      fullWidth
      maxWidth="md"
      open={true}
      onClose={handleClose}
    >
      <DialogTitle sx={{ pl: 3, pr: 6, display: 'flex', alignItems: 'center' }}>
        <Box flex={1}>{item.title}</Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pl: 3, pr: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>        
        <FormControl error={boardsError} variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel id="multi-select-label">Select Boards</InputLabel>
          <Select
            labelId="multi-select-label"
            multiple
            value={selectedBoards}
            onChange={handleChange}
            renderValue={(selected) => selected.map(id => boards.find(board => board.id === id)?.title).join(', ')}
            label="Select Boards"
          >
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                <Checkbox checked={selectedBoards.indexOf(board.id) > -1} />
                <ListItemText primary={board.title} />
              </MenuItem>
            ))}
          </Select>
          {boardsError && <FormHelperText>Please select at least one board</FormHelperText>}
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Complete By"
            value={completeBy}
            onChange={(newValue) => setCompleteBy(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
              />
            }
            label="Enable Notifications"
          />
        </Box>

        {enableNotifications && (          
          <>
          <FormControl fullWidth>
            <InputLabel>Notification Frequency</InputLabel>
            <Select
              value={notificationFrequency}
              onChange={(e) => setNotificationFrequency(e.target.value)}
              label="Notification Frequency"
            >
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label="Days before Complete By"
            value={notificationDaysBefore}
            onChange={(e) => setNotificationDaysBefore(parseInt(e.target.value))}                
              helperText="Number of days before Complete By date to start sending notifications"
            />
          </>
        )}

        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          style={{ height: '100%', width: '100%' }}
        />

        <Button variant="contained" color="primary" onClick={() => handleSave(item.id)}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsPopup;
