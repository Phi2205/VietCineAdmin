import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Button, 
  Divider, 
  CircularProgress, 
  Grid,
  Stack,
  Chip,
  alpha,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  VpnKey as RoleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AccountPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: contextUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin chi tiết của user từ API
        const response = await axios.get('http://localhost:8080/api/auth/me');
        setUser(response.data);
        console.log('User data fetched:', response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Tính thời gian thành viên
  const calculateMembershipTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} ngày`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng`;
    return `${Math.floor(diffDays / 365)} năm`;
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: '80vh',
          flexDirection: 'column',
          backgroundColor: '#121212'
        }}
      >
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#fff' }}>
          Đang tải thông tin tài khoản...
        </Typography>
      </Box>
    );
  }

  if (!user && !contextUser) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          flexDirection: 'column',
          p: 3,
          backgroundColor: '#121212'
        }}
      >
        <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
          Vui lòng đăng nhập để xem thông tin tài khoản
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/login')}
          sx={{
            borderRadius: 2,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
            boxShadow: '0 3px 5px 2px rgba(107, 115, 255, .3)',
            px: 3,
            py: 1
          }}
        >
          Đăng nhập
        </Button>
      </Box>
    );
  }

  // Sử dụng dữ liệu từ API nếu có, nếu không thì sử dụng từ context
  const userData = user || contextUser;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        padding: { xs: 2, md: 4 },
        background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}
    >
      <Paper 
        elevation={10} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          maxWidth: 1000, 
          width: '100%',
          borderRadius: 3,
          backgroundColor: alpha('#121212', 0.8),
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          boxShadow: `0 8px 32px 0 ${alpha('#000', 0.37)}`,
          color: '#fff',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Quay lại">
              <IconButton 
                onClick={() => navigate(-1)}
                sx={{ 
                  color: alpha('#fff', 0.7),
                  mr: 2,
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: alpha('#fff', 0.1),
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography 
              variant="h4" 
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Thông tin tài khoản
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/accounts/admins/edit/${user.userId}`)}
            sx={{
              borderRadius: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
              boxShadow: '0 3px 5px 2px rgba(107, 115, 255, .3)',
              px: 3
            }}
          >
            Chỉnh sửa
          </Button>
        </Box>
        
        <Divider sx={{ borderColor: alpha('#fff', 0.1), mb: 4 }} />
        
        <Grid container spacing={4}>
          {/* Cột bên trái hiển thị avatar và thông tin cơ bản */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 3, md: 0 } }}>
              <Avatar
                src={userData?.avatar}
                alt={userData?.fullName}
                sx={{ 
                  width: 180, 
                  height: 180, 
                  mb: 3,
                  border: '4px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`,
                }}
              />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                {userData?.fullName}
              </Typography>
              
              <Chip 
                label={userData?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'} 
                color={userData?.role === 'ADMIN' ? 'secondary' : 'primary'}
                sx={{ mt: 1, fontWeight: 'medium' }}
              />
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, color: alpha('#fff', 0.7), textAlign: 'center' }}
              >
                Thành viên {calculateMembershipTime(userData?.createdAt)}
              </Typography>
            </Box>
          </Grid>
          
          {/* Cột bên phải hiển thị thông tin chi tiết */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ color: theme.palette.primary.light, mr: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {userData?.email}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ color: theme.palette.primary.light, mr: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    Họ và tên
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {userData?.fullName}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RoleIcon sx={{ color: theme.palette.primary.light, mr: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    Vai trò
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {userData?.role === 'ADMIN' ? 'ADMIN' : 'USER'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ color: theme.palette.primary.light, mr: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    Số điện thoại
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {userData?.phone || 'Chưa cập nhật'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ color: theme.palette.primary.light, mr: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    Địa chỉ
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {userData?.address || 'Chưa cập nhật'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ color: theme.palette.primary.light, mr: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    Ngày tạo tài khoản
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formatDate(userData?.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AccountPage;