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
  OutlinedInput,
  Chip,  
  Box,
  FormHelperText,
  Button,
  Checkbox, ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { BoardContext } from '../../boards/contexts/BoardContext';

const TaskDetailsPopup = ({ open, title, description, setDescription, handleClose, selectedBoardsOptions }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { boards } = React.useContext(BoardContext);
  
  //const [boardsError, setBoardsError] = useState(false);

  const [selectedBoards, setSelectedBoards] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedBoards(typeof value === 'string' ? value.split(',') : value);
  }; 

  return (
    <Dialog
      fullScreen={isSmallScreen}
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle sx={{ pl: 3, pr: 6, display: 'flex', alignItems: 'center' }}>
        <Box flex={1}>{title}</Box>
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
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
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
        </FormControl>

        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          style={{ height: '100%', width: '100%' }}
        />

        <Button variant="contained" color="primary">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsPopup;
