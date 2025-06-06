import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Badge,
  Collapse,
  Tooltip,
  Button
} from '@mui/material';
import {
  AccountCircle,
  Movie as MovieIcon,
  Event as ShowtimeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  ExpandMore,
  ExpandLess,
  Person as PersonIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const drawerWidth = 240;

// Interceptor thêm token vào header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [openAccountMenu, setOpenAccountMenu] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    // Xóa thông tin người dùng trên giao diện ngay lập tức
    setUsername('');
    setAvatarUrl('');
    
    // Đóng drawer nếu đang mở
    setOpen(false);
    
    // Thực hiện đăng xuất trong context
    logout();
    
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };

  const navigateToHome = () => {
    navigate('/');
    setOpen(false);
  };

  const navigateToAccountDetails = () => {
    navigate('/account');
    setOpen(false);
  };

  // Gọi API lấy avatar khi vào trang và khi user thay đổi
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Nếu không có token, không cần gọi API
      const token = localStorage.getItem('token');
      if (!token) {
        setUsername('');
        setAvatarUrl('');
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:8080/api/auth/me');
        setAvatarUrl(response.data.avatar || '');
        setUsername(response.data.fullName || 'User');
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        
        // Nếu token hết hạn hoặc không hợp lệ, tự động đăng xuất
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleLogout();
        }
      }
    };

    fetchUserInfo();
  }, [user]); // Dependency vào user để cập nhật khi user thay đổi

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: '#333',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            
            {/* Dashboard button giờ có chức năng điều hướng về trang chủ */}
            <Tooltip title="Về trang chủ">
              <Button 
                variant="text" 
                color="primary" 
                // startIcon={<DashboardIcon />}
                onClick={navigateToHome}
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                  }
                }}
              >
                Dashboard
              </Button>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>{username || 'Guest'}</Typography>
            <Tooltip title="Thông tin tài khoản">
              <IconButton onClick={navigateToAccountDetails}>
                <Avatar
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid',
                    borderColor: username ? 'primary.main' : 'grey.400'
                  }}
                  alt={username || 'Guest'}
                  src={avatarUrl}
                >
                  {!avatarUrl && (username?.charAt(0) || 'G')}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer trái */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#2c3e50',
            color: 'white',
          }
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ADMINDek
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: '#34495e' }} />

        <List>
          {/* Trang chủ */}
          <ListItem button onClick={navigateToHome}>
            <ListItemIcon><HomeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>

          {/* Thông tin cá nhân */}
          <ListItem button onClick={navigateToAccountDetails}>
            <ListItemIcon><PersonIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Thông tin cá nhân" />
          </ListItem>

          <Divider sx={{ borderColor: '#34495e', my: 1 }} />

          <ListItem button onClick={() => setOpenAccountMenu(!openAccountMenu)}>
            <ListItemIcon>
              <AccountCircle sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Quản lý tài khoản" />
            {openAccountMenu ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>

          <Collapse in={openAccountMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button onClick={() => handleMenuItemClick('/accounts/admins')} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AccountCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Tài khoản Admin" />
              </ListItem>
              <ListItem button onClick={() => handleMenuItemClick('/accounts/user')} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AccountCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Tài khoản User" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={() => handleMenuItemClick('/movies')}>
            <ListItemIcon><MovieIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Danh sách phim" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/casts')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Danh sách diễn viên" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/directors')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Danh sách đạo diễn" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/showtimes')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Danh sách lịch chiếu" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/theaterBrands')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Danh sách hãng rạp chiếu phim" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/screens')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Danh sách phòng chiếu" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/foods')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Đồ ăn" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/vouchers')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Mã giảm giá" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/priceAdjustments')}>
            <ListItemIcon><ShowtimeIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Điều chỉnh giá" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/revenue')}>
            <ListItemIcon><BarChartIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Doanh thu" />
          </ListItem>
        </List>

        <Divider sx={{ borderColor: '#34495e' }} />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon sx={{ color: 'white' }} /></ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItem>
      </Drawer>

      {/* Nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#000',
          // p: 3,
          mt: 8,
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;