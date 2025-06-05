import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  CircularProgress,
  Chip,
  TablePagination,
  Avatar,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const UserList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    
    axios.get('http://localhost:8080/api/auth/me')
      .then(response => {
        setCurrentUser(response.data);
        console.log("Current user:", response.data);
      })
      .catch(error => {
        console.error("Error fetching current user:", error);
      });
  }, [page, rowsPerPage]);

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`http://localhost:8080/api/admin/list?page=${page}&size=${rowsPerPage}`)
      .then(response => {
        const data = response.data;
        setUsers(data.content || []);
        console.log('Fetched users:', data.content);
        setTotalUsers(data.totalElements || 0);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users: ' + (error.response?.data?.message || error.message));
      })
      .finally(() => setLoading(false));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?') && currentUser?.userId !== id) {
      axios.delete(`http://localhost:8080/api/admin/delete/${id}`)
        .then(response => {
          toast.success(response.data.message || 'Xóa người dùng thành công');
          fetchUsers();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          toast.error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
        });
    }
    else if (currentUser?.userId === id) {
      toast.error('Bạn không thể xóa tài khoản của chính mình!');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    if (!role) return 'default';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return alpha(theme.palette.error.main, 0.2);
      case 'manager':
        return alpha(theme.palette.warning.main, 0.2);
      case 'user':
        return alpha(theme.palette.success.main, 0.2);
      default:
        return alpha(theme.palette.primary.main, 0.2);
    }
  };
  
  const getRoleBorderColor = (role) => {
    if (!role) return 'default';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return alpha(theme.palette.error.main, 0.5);
      case 'manager':
        return alpha(theme.palette.warning.main, 0.5);
      case 'user':
        return alpha(theme.palette.success.main, 0.5);
      default:
        return alpha(theme.palette.primary.main, 0.5);
    }
  };
  
  const getRoleTextColor = (role) => {
    if (!role) return '#fff';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return theme.palette.error.light;
      case 'manager':
        return theme.palette.warning.light;
      case 'user':
        return theme.palette.success.light;
      default:
        return theme.palette.primary.light;
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
    }}>
      <Paper 
        elevation={10} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          backgroundColor: alpha('#121212', 0.8),
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          boxShadow: `0 8px 32px 0 ${alpha('#000', 0.37)}`,
          color: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Quản Lý Người Dùng
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              sx={{ 
                mr: 2,
                borderRadius: 2,
                backgroundColor: alpha('#fff', 0.1),
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.2),
                }
              }}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/accounts/admins/add')}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #6b73ff 30%, #09d3ac 90%)',
                boxShadow: '0 3px 5px 2px rgba(107, 115, 255, .3)',
              }}
            >
              Thêm Người Dùng
            </Button>
          </Box>
        </Box>

        {/* Search box */}
        <TextField
          placeholder="Tìm kiếm theo tên, email, địa chỉ hoặc số điện thoại..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              backgroundColor: alpha('#fff', 0.05),
              borderRadius: 2,
              color: '#fff',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.5),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha('#fff', 0.2),
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: alpha('#fff', 0.7) }} />
              </InputAdornment>
            ),
          }}
        />

        <Paper 
          elevation={6} 
          sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            backgroundColor: alpha('#121212', 0.5),
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: theme.palette.primary.light }} />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ 
                maxHeight: '60vh',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha('#fff', 0.05),
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                  borderRadius: '10px',
                }
              }}>
                <Table>
                  <TableHead sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}>
                    <TableRow>
                      <TableCell sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        Avatar
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        Họ và tên
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        Số điện thoại
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        Địa chỉ
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        Phân quyền
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                      }}>
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.userId} 
                        hover 
                        sx={{
                          '&:hover': { 
                            backgroundColor: alpha('#fff', 0.05),
                          },
                          borderBottom: `1px solid ${alpha('#fff', 0.1)}`
                        }}
                      >
                        <TableCell sx={{ color: '#fff', border: 'none' }}>
                          <Avatar
                            src={user.avatar || '/default-avatar.png'}
                            alt={user.fullName}
                            sx={{ 
                              width: 50, 
                              height: 50,
                              border: '2px solid',
                              borderColor: alpha(theme.palette.primary.main, 0.5),
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#fff', border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.primary.light }} />
                            {user.email}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#fff', border: 'none', fontWeight: 'bold' }}>
                          {user.fullName}
                        </TableCell>
                        <TableCell sx={{ color: '#fff', border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.primary.light }} />
                            {user.phone || 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#fff', 
                          border: 'none',
                          maxWidth: '150px',
                        }}>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {user.address || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#fff', border: 'none' }}>
                          <Chip
                            label={user.role}
                            sx={{
                              fontWeight: 'bold',
                              color: getRoleTextColor(user.role),
                              backgroundColor: getRoleColor(user.role),
                              border: '1px solid',
                              borderColor: getRoleBorderColor(user.role),
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                size="small"
                                sx={{ 
                                  color: theme.palette.info.light,
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.info.light, 0.1)
                                  }
                                }}
                                onClick={() => handleEdit(user.userId)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                sx={{ 
                                  color: theme.palette.error.light,
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.light, 0.1)
                                  }
                                }}
                                onClick={() => handleDelete(user.userId)}
                                disabled={currentUser?.userId === user.userId}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4, border: 'none', color: alpha('#fff', 0.7) }}>
                          <Typography variant="body1">
                            {searchTerm ? 'Không tìm thấy người dùng nào phù hợp' : 'Không có người dùng nào'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalUsers}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    color: '#fff',
                    '& .MuiTablePagination-selectIcon': {
                      color: alpha('#fff', 0.7),
                    },
                    '& .MuiTablePagination-select': {
                      color: '#fff',
                    },
                    '& .MuiTablePagination-selectLabel': {
                      color: alpha('#fff', 0.7),
                    },
                    '& .MuiTablePagination-displayedRows': {
                      color: alpha('#fff', 0.7),
                    },
                    '& .MuiIconButton-root': {
                      color: alpha('#fff', 0.7),
                      '&.Mui-disabled': {
                        color: alpha('#fff', 0.3),
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default UserList;