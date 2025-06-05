import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, Avatar,
  Stack, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, alpha, useTheme, InputAdornment,
  IconButton, Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Visibility,
  VisibilityOff,
  Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const roles = ["ADMIN", "USER"];

const AddAdminForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    role: 'ADMIN'
  });
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatarUrl(url);
    
    // Nếu URL hợp lệ, set preview ngay lập tức
    if (isValidUrl(url)) {
      setAvatarPreview(url);
      setAvatarError('');
    } else if (url) {
      setAvatarError('URL ảnh không hợp lệ');
      setAvatarPreview(null);
    } else {
      setAvatarError('');
      setAvatarPreview(null);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateImageUrl = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve(false);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra URL ảnh nếu được cung cấp
    if (avatarUrl) {
      try {
        const isValid = await validateImageUrl(avatarUrl);
        if (!isValid) {
          setAvatarError('URL ảnh không hợp lệ hoặc ảnh không tồn tại');
          toast.error('URL ảnh không hợp lệ. Vui lòng kiểm tra lại URL.');
          return;
        }
      } catch (error) {
        console.error('Error validating image URL:', error);
        setAvatarError('Không thể kiểm tra URL ảnh');
        return;
      }
    }
    
    const payload = {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      phone: user.phone || null,
      address: user.address || null,
      role: user.role,
      avatar: avatarUrl || null  // Thêm URL ảnh vào payload
    };
    
    setLoading(true);
    
    axios.post('http://localhost:8080/api/admin/register', payload)
      .then(res => {
        toast.success(res.data.message || 'Thêm admin thành công!');
        navigate('/accounts/admins');
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra!');
      })
      .finally(() => setLoading(false));
  };

  // Common TextField style that applies to all fields
  const textFieldStyle = {
    '& .MuiFilledInput-root': {
      backgroundColor: alpha('#fff', 0.05),
      color: '#fff', // Text color
      '&:hover': {
        backgroundColor: alpha('#fff', 0.08),
      },
      '&.Mui-focused': {
        backgroundColor: alpha('#fff', 0.08),
      }
    },
    '& .MuiInputLabel-root': {
      color: alpha('#fff', 0.8), // More visible label
    },
    '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
      color: theme.palette.primary.light, // Shrunk label color
    },
    '& .MuiFilledInput-input': {
      color: '#fff', // Ensure text is white
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.error.light
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4,
        p: 2,
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}
    >
      <Paper 
        elevation={10} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 700, 
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
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom 
          textAlign="center"
          sx={{
            mb: 4,
            background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Thêm Admin Mới
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Avatar section with URL input */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 2
            }}>
              <Avatar
                src={avatarPreview || "/default-avatar.png"}
                sx={{ 
                  width: 130, 
                  height: 130, 
                  mb: 3,
                  border: '4px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                }}
                alt="Avatar"
              />
              
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <TextField
                  label="URL Hình ảnh đại diện"
                  value={avatarUrl}
                  onChange={handleAvatarUrlChange}
                  variant="filled"
                  fullWidth
                  error={!!avatarError}
                  helperText={avatarError || "Nhập URL hình ảnh (https://example.com/image.jpg)"}
                  placeholder="https://example.com/avatar.jpg"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon sx={{ color: theme.palette.primary.light }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Box>
            </Box>

            <Divider sx={{ borderColor: alpha('#fff', 0.1), my: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                required
                variant="filled"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: theme.palette.primary.light }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyle}
              />

              <TextField
                label="Mật khẩu"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                onChange={handleChange}
                required
                variant="filled"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.primary.light }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: alpha('#fff', 0.7) }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={textFieldStyle}
              />

              <TextField
                label="Họ và tên"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                required
                variant="filled"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: theme.palette.primary.light }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyle}
              />

              <TextField
                label="Số điện thoại"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                variant="filled"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: theme.palette.primary.light }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyle}
              />
            </Box>

            {/* Single line address field */}
            <TextField
              label="Địa chỉ"
              name="address"
              value={user.address}
              onChange={handleChange}
              variant="filled"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon sx={{ color: theme.palette.primary.light }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />

            {/* Using a custom div for role display */}
            <Box
              sx={{
                ...textFieldStyle,
                display: 'flex',
                flexDirection: 'column',
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  ml: '12px',
                  mb: 0.5,
                  fontWeight: 'medium',
                  color: theme.palette.primary.light,
                  position: 'relative',
                }}
              >
                Phân quyền
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  backgroundColor: alpha('#fff', 0.05),
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  borderBottom: `1px solid ${alpha('#fff', 0.2)}`,
                  py: 2,
                  px: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    pl: 1,
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {user.role} {/* Keep as uppercase */}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ 
              borderTop: '1px solid',
              borderColor: alpha('#fff', 0.1),
              pt: 3,
              mt: 2
            }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/accounts/admins')}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    px: 3
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
                    boxShadow: '0 3px 5px 2px rgba(107, 115, 255, .3)',
                    px: 3
                  }}
                >
                  Thêm
                </Button>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddAdminForm;