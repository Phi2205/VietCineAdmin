import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  alpha,
  useTheme,
  Avatar,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Image as ImageIcon,
  VpnKey as RoleIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AccountForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState('');
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    role: 'ADMIN',
    providerId: null,
    uid: null,
    idToken: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      ...form,
      avatar: avatarUrl || null
    };
    
    setLoading(true);
    
    axios.post('http://localhost:8080/api/auth/register', payload)
      .then(() => {
        toast.success('Tài khoản đã được tạo thành công!');
        navigate('/account');
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
      })
      .finally(() => {
        setLoading(false);
      });
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
    },
    '& .MuiInputAdornment-root': {
      color: theme.palette.primary.light
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        pt: 4,
        pb: 6,
        px: 2,
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 3, md: 5 },
          width: '100%',
          maxWidth: 900,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
                <ArrowBack />
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
              Tạo tài khoản mới
            </Typography>
          </Box>
        </Box>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Cột bên trái cho avatar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: { xs: 2, md: 0 }
              }}>
                <Avatar
                  src={avatarPreview || "/default-avatar.png"}
                  sx={{ 
                    width: 180, 
                    height: 180, 
                    mb: 3,
                    border: '4px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                  }}
                  alt="Avatar"
                />
                
                <TextField
                  label="URL Hình ảnh đại diện"
                  value={avatarUrl}
                  onChange={handleAvatarUrlChange}
                  variant="filled"
                  fullWidth
                  error={!!avatarError}
                  helperText={avatarError}
                  placeholder="https://example.com/avatar.jpg"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Box>
            </Grid>
            
            {/* Cột bên phải cho thông tin */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  variant="filled"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
                
                <TextField
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  variant="filled"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
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
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  variant="filled"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
                
                <TextField
                  label="Số điện thoại"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  variant="filled"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
                
                <TextField
                  label="Địa chỉ"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  variant="filled"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
                
                <FormControl variant="filled" fullWidth>
                  <InputLabel id="role-select-label" sx={{ color: alpha('#fff', 0.8) }}>Vai trò</InputLabel>
                  <Select
                    labelId="role-select-label"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    sx={{
                      ...textFieldStyle,
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
                    startAdornment={
                      <InputAdornment position="start" sx={{ mr: 1, ml: -0.5 }}>
                        <RoleIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                    <MenuItem value="USER">Người dùng</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            borderTop: '1px solid',
            borderColor: alpha('#fff', 0.1),
            pt: 4,
            mt: 4,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate('/account')}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'bold',
                  px: 3
                }}
              >
                Hủy
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
                  boxShadow: '0 3px 5px 2px rgba(107, 115, 255, .3)',
                  px: 3,
                  py: 1
                }}
              >
                TẠO TÀI KHOẢN
              </Button>
            </Stack>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AccountForm;