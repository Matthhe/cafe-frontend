import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import api from '../api/axios';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    api.get('/menu-items').then((res) => setMenu(res.data));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Меню</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {menu.map((item) => (
          <Box key={item.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography color="text.secondary">{item.category}</Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>{item.price} ₽</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">В корзину</Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
}