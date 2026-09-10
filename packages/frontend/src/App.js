import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './App.css';

const API_URL = '/api/todos';

const requestJson = async (url, options) => {
  const response = await fetch(url, options);
  if (response.ok === false) {
    throw new Error('Request failed');
  }
  return response.json();
};

const request = async (url, options) => {
  const response = await fetch(url, options);
  if (response.ok === false) {
    throw new Error('Request failed');
  }
};

// React Query hook for fetching todos
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    retry: false,
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (response.ok === false) {
        throw new Error('Unable to load todos');
      }
      return response.json();
    },
  });
};

function App() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const { data: todos = [], isLoading, isError } = useTodos();

  // Mutation for adding a new todo
  const addTodoMutation = useMutation({
    mutationFn: async (title) => {
      return requestJson(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
    },
  });

  // Mutation for toggling todo completion
  const toggleTodoMutation = useMutation({
    mutationFn: async (id) => {
      await request(`${API_URL}/${id}/toggle`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id) => {
      await request(`${API_URL}/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const editTodoMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      return requestJson(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditingTodoId(null);
      setEditingTodoTitle("");
    },
  });

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodoMutation.mutate(newTodoTitle);
    }
  };

  const handleToggleTodo = (id) => {
    toggleTodoMutation.mutate(id);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleStartEditing = (todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  };

  const handleEditTodo = (e, id) => {
    e.preventDefault();
    if (editingTodoTitle.trim()) {
      editTodoMutation.mutate({ id, title: editingTodoTitle.trim() });
    }
  };

  const incompleteCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const mutationError = [
    addTodoMutation,
    toggleTodoMutation,
    deleteTodoMutation,
    editTodoMutation,
  ].some((mutation) => mutation.isError);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            TODO App
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Session 5: Agentic Development
          </Typography>
        </Paper>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleAddTodo}
              sx={{ display: 'flex', gap: 2 }}
            >
              <TextField
                fullWidth
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                variant="outlined"
                size="medium"
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: 120 }}
              >
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Box role="alert" sx={{ mb: 3 }}>
            Unable to load todos
          </Box>
        )}
        {mutationError && (
          <Box role="alert" sx={{ mb: 3 }}>
            Unable to update todos
          </Box>
        )}

        <Card>
          <List sx={{ p: 0 }}>
            {todos.length === 0 ? (
              <ListItem>
                <Typography sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                  No todos yet
                </Typography>
              </ListItem>
            ) : todos.map((todo, index) => (
              <ListItem
                key={todo.id}
                sx={{
                  borderBottom: index < todos.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                >
                <Checkbox checked={todo.completed} onChange={() => handleToggleTodo(todo.id)} sx={{ mr: 2 }} />
                {editingTodoId === todo.id ? (
                  <Box component="form" onSubmit={(e) => handleEditTodo(e, todo.id)} sx={{ display: "flex", flex: 1, gap: 1 }}>
                    <TextField fullWidth size="small" value={editingTodoTitle} onChange={(e) => setEditingTodoTitle(e.target.value)} inputProps={{ "aria-label": `Edit todo ${todo.title}` }} />
                    <Button type="submit">Save changes</Button>
                  </Box>
                ) : (
                  <Typography sx={{ flex: 1, textDecoration: todo.completed ? "line-through" : "none", color: todo.completed ? "text.secondary" : "text.primary" }}>
                    {todo.title}
                  </Typography>
                )}
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label={`Edit todo ${todo.title}`} onClick={() => handleStartEditing(todo)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    aria-label={`Delete todo ${todo.title}`}
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Chip label={`${incompleteCount} items left`} color="primary" />
          <Chip label={`${completedCount} completed`} color="success" />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
