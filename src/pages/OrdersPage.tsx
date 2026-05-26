import { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Button } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  id: number;
  menuItem: { name: string };
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: number;
  status: string;
  total: number;
  tableNumber?: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { role } = useAuth();

  const fetchOrders = async (status?: string) => {
    const params = status ? { status } : {};
    const res = await api.get('/orders', { params });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatus = async (id: number, newStatus: string) => {
    await api.patch(`/orders/${id}`, { status: newStatus });
    fetchOrders(); 
  };

  const canChangeStatus = role === 'COOK' || role === 'CHEF' || role === 'ADMINISTRATOR';

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Заказы</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Столик</TableCell>
            <TableCell>Состав</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Статус</TableCell>
            {canChangeStatus && <TableCell>Действие</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.tableNumber ?? 'Навынос'}</TableCell>
              <TableCell>
                {order.items.map((item) => `${item.menuItem.name} x${item.quantity}`).join(', ')}
              </TableCell>
              <TableCell>{order.total} ₽</TableCell>
              <TableCell>{order.status}</TableCell>
              {canChangeStatus && (
                <TableCell>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) => changeStatus(order.id, e.target.value)}
                  >
                    <MenuItem value="PENDING">Ожидает</MenuItem>
                    <MenuItem value="PREPARING">Готовится</MenuItem>
                    <MenuItem value="READY">Готов</MenuItem>
                    <MenuItem value="COMPLETED">Выполнен</MenuItem>
                  </Select>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}