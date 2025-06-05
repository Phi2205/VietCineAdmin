import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Paper,
    Stack,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Avatar,
    IconButton,
    InputAdornment,
    alpha,
    useTheme,
    Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { 
    Save as SaveIcon, 
    ArrowBack, 
    Person as PersonIcon,
    Phone as PhoneIcon,
    Home as HomeIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Image as ImageIcon
} from '@mui/icons-material';

const roles = ["ADMIN", "USER"];

const AdminForm = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: '',
        avatar: '',
        role: 'ADMIN'
    });
    const [loading, setLoading] = useState(!!id);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarError, setAvatarError] = useState('');

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/api/users/${id}`)
                .then(response => {
                    const data = response.data;
                    console.log('Fetched users:', data);
                    setUser({
                        email: data.email || '',
                        password: '', // Password field is typically empty on edit
                        fullName: data.fullName || '',
                        phone: data.phone || '',
                        address: data.address || '',
                        avatar: data.avatar || '',
                        role: data.role || ''
                    });
                    
                    if (data.avatar) {
                        setAvatarPreview(data.avatar);
                        setAvatarUrl(data.avatar);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    toast.error('Error fetching user: ' + (error.response?.data?.message || error.message));
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [id]);

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
            // Vẫn giữ preview nếu đang chỉnh sửa user hiện có
            if (!id) {
                setAvatarPreview(null);
            }
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

        // Tạo dữ liệu để gửi
        const userData = {
            email: user.email,
            fullName: user.fullName,
            phone: user.phone || null,
            address: user.address || null,
            role: user.role,
            avatar: avatarUrl || null
        };

        // Chỉ thêm mật khẩu nếu được cung cấp
        if (user.password) {
            userData.password = user.password;
        }

        const request = id
            ? axios.put(`http://localhost:8080/api/users/${id}`, userData)
            : axios.post('http://localhost:8080/api/users', userData);

        request
            .then(response => {
                toast.success(response.data.message || 'User saved successfully');
                navigate('/accounts/admins');
            })
            .catch(error => {
                console.error('Error saving user:', error);
                toast.error(error.response?.data?.message || 'Error saving user');
            });
    };

    // Common TextField style that applies to all fields
    const textFieldStyle = {
        '& .MuiFilledInput-root': {
            backgroundColor: alpha('#fff', 0.05),
            color: '#fff',
            '&:hover': {
                backgroundColor: alpha('#fff', 0.08),
            },
            '&.Mui-focused': {
                backgroundColor: alpha('#fff', 0.08),
            }
        },
        '& .MuiInputLabel-root': {
            color: alpha('#fff', 0.8),
        },
        '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
            color: theme.palette.primary.light,
        },
        '& .MuiFilledInput-input': {
            color: '#fff',
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
                    {id ? 'Chỉnh Sửa Admin' : 'Thêm Admin Mới'}
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress sx={{ color: theme.palette.primary.light }} />
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Avatar Preview and URL Input */}
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                mb: 2 
                            }}>
                                <Avatar
                                    src={avatarPreview || '/default-avatar.png'}
                                    sx={{ 
                                        width: 130, 
                                        height: 130, 
                                        mb: 3,
                                        border: '4px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                        boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                                    }}
                                    alt={user.fullName || 'User avatar'}
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
                                {/* Email field - readonly when editing */}
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
                                        readOnly: !!id, // Readonly khi đang chỉnh sửa (có id)
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: theme.palette.primary.light }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        ...textFieldStyle,
                                        '& .MuiFilledInput-root': {
                                            ...textFieldStyle['& .MuiFilledInput-root'],
                                            // Thêm style cho trường hợp readonly
                                            ...(id && {
                                                backgroundColor: alpha('#fff', 0.02),
                                                cursor: 'not-allowed',
                                                '&:hover': {
                                                    backgroundColor: alpha('#fff', 0.02),
                                                },
                                            })
                                        },
                                    }}
                                    error={user.email === ''}
                                    helperText={user.email === '' ? 'Email không được để trống' : (id ? 'Email không thể thay đổi' : '')}
                                />

                                <TextField
                                    label="Mật khẩu"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={user.password}
                                    onChange={handleChange}
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
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={textFieldStyle}
                                    helperText={id ? 'Để trống nếu không muốn thay đổi mật khẩu' : ''}
                                    required={!id} // Bắt buộc nhập khi tạo mới
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
                                    error={user.fullName === ''}
                                    helperText={user.fullName === '' ? 'Họ tên không được để trống' : ''}
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
                                        {user.role} {/* Showing ADMIN in uppercase */}
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
                                        {id ? 'Cập nhật' : 'Thêm'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </form>
                )}
            </Paper>
        </Box>
    );
};

export default AdminForm;