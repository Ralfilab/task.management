import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,  
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { BoardContext } from "../contexts/BoardContext";

const BoardListContainer = () => {
  const { boards, addBoard, updateBoard } = useContext(BoardContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [title, setTitle] = useState("");

  const generateUniqueId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddNew = () => {
    setTitle("");
    setCurrentBoard(null);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (currentBoard !== null) {
      updateBoard(currentBoard, title);
    } else {
      addBoard({ id: generateUniqueId(), title });
    }
    setOpenDialog(false);
  };

  return (    
    <div>
      <Button variant="contained" color="primary" onClick={handleAddNew}>
        Add New
      </Button>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {boards.map((board, index) => (
          <BoardCard key={board.id} board={board} index={index} />
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentBoard !== null ? "Edit Board" : "Add New Board"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>    
  );
};

const BoardCard = ({ board, index }) => {
  const { handleEdit, handleRemove } = useContext(BoardContext);

  return (
    <Grid xs={12} sm={6} md={4}>
      <Card
        style={{
          backgroundColor: "#e3f2fd",
          border: "1px solid #90caf9",
          borderRadius: "8px",
        }}
      >
        <CardContent>
          <Typography variant="h6" style={{ color: "#0d47a1" }}>
            {board.title}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            ID: {board.id}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={() => handleEdit(index)}>
            Edit
          </Button>
          <Button size="small" color="secondary" onClick={() => handleRemove(index)}>
            Remove
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default BoardListContainer;