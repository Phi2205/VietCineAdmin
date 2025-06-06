import React, { useContext } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Lấy user từ context

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: 4,
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Chào mừng đến với trang quản lý phim
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ maxWidth: '800px', mb: 5 }}>
        Quản lý phim và lịch chiếu dễ dàng
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
        {/* Nếu chưa đăng nhập, hiển thị nút Đăng nhập */}
        {!user && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          >
            Đăng nhập
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default HomePage;