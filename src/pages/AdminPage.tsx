import { useState } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, Grid, Paper } from '@mui/material';
import api from '../api/axios';

export default function AdminPage() {
  const [staff, setStaff] = useState({ name: '', email: '', password: '', role: 'WAITER' });
  const [menuItem, setMenuItem] = useState({ name: '', price: '', category: '' });
  const [message, setMessage] = useState('');

  const createStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/staff', { ...staff, price: undefined }); // price не нужен
      setMessage('Сотрудник создан, письмо отправлено');
      setStaff({ name: '', email: '', password: '', role: 'WAITER' });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Ошибка');
    }
  };

  const createMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/menu-items', [{ ...menuItem, price: parseFloat(menuItem.price) }]);
      setMessage('Блюдо добавлено');
      setMenuItem({ name: '', price: '', category: '' });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Админ-панель</Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Создать сотрудника</Typography>
        <form onSubmit={createStaff}>
          <TextField label="Имя" fullWidth margin="normal" value={staff.name} onChange={(e) => setStaff({ ...staff, name: e.target.value })} required />
          <TextField label="Email" type="email" fullWidth margin="normal" value={staff.email} onChange={(e) => setStaff({ ...staff, email: e.target.value })} required />
          <TextField label="Пароль" type="password" fullWidth margin="normal" value={staff.password} onChange={(e) => setStaff({ ...staff, password: e.target.value })} required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Роль</InputLabel>
            <Select value={staff.role} label="Роль" onChange={(e) => setStaff({ ...staff, role: e.target.value })}>
              <MenuItem value="WAITER">Официант</MenuItem>
              <MenuItem value="COOK">Повар</MenuItem>
              <MenuItem value="ADMINISTRATOR">Администратор</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Создать</Button>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Добавить блюдо</Typography>
        <form onSubmit={createMenuItem}>
          <TextField label="Название" fullWidth margin="normal" value={menuItem.name} onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })} required />
          <TextField label="Цена" type="number" fullWidth margin="normal" value={menuItem.price} onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })} required />
          <TextField label="Категория" fullWidth margin="normal" value={menuItem.category} onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Добавить</Button>
        </form>
      </Paper>
    </Container>
  );
}