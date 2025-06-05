import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Avatar, TextField, InputAdornment,
  Container, Card, Chip, Grid, Divider, Fade, 
  CircularProgress, useTheme, Table, TableContainer, TableHead, TableRow, 
  TableCell, TableBody, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ReceiptIcon from '@mui/icons-material/Receipt';

const UserBookingList = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();

  useEffect(() => {
    // Lấy thông tin người dùng
    axios.get(`http://localhost:8080/api/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error('Lỗi khi lấy thông tin user:', err));

    // Lấy danh sách booking
    axios.get(`http://localhost:8080/api/bookings/user/${id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error('Lỗi khi lấy danh sách booking:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const filteredBookings = bookings.filter(b => {
    const lowercasedSearch = searchTerm.toLowerCase();
    
    // Chuyển đổi bookingId thành chuỗi trước khi so sánh
    const bookingIdStr = String(b.bookingId);
    
    return bookingIdStr.toLowerCase().includes(lowercasedSearch) ||
      b.movieTitle?.toLowerCase().includes(lowercasedSearch) ||
      b.status?.toLowerCase().includes(lowercasedSearch) ||
      b.seatNames?.toLowerCase().includes(lowercasedSearch) ||
      b.foodDetails?.toLowerCase().includes(lowercasedSearch) ||
      b.theaterName?.toLowerCase().includes(lowercasedSearch) ||
      b.screenNumber?.toLowerCase().includes(lowercasedSearch);
  });

  // Format date để hiển thị theo định dạng dd-mm-yyyy hh:mm
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Xác định màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'success':
        return {
          bg: '#e6f7e9',
          color: '#2e7d32'
        };
      case 'failed':
        return {
          bg: '#fdeded',
          color: '#d32f2f'
        };
      case 'pending':
        return {
          bg: '#fff8e1',
          color: '#f57c00'
        };
      default:
        return {
          bg: '#f5f5f5',
          color: '#757575'
        };
    }
  };

  return (
    <Box sx={{ 
      bgcolor: '#1c1c1c', 
      minHeight: '100vh',
      pt: 2
    }}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        {/* Tiêu đề trang */}
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#5878ed',
            fontWeight: 'bold',
            mb: 3,
            pl: 2
          }}
        >
          Lịch Sử Đặt Vé
        </Typography>
        <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }}/>

        {/* Phần thông tin người dùng */}
        {user && (
          <Box sx={{ mb: 3 }}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 2,
                backgroundColor: '#4d6be8',
                backgroundImage: 'linear-gradient(to right, #4d6be8, #5f9bff)',
                position: 'relative',
                height: '100px',
                mb: 6,
                overflow: 'visible'
              }}
            >
              <Avatar
                src={user.avatar || '/default-avatar.png'}
                alt={user.fullName}
                sx={{
                  width: 90,
                  height: 90,
                  border: '4px solid white',
                  position: 'absolute',
                  bottom: '-45px',
                  left: 0,
                  right: 0,
                  mx: 'auto'
                }}
              />
            </Card>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mt: 1
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  color: '#fff'
                }}
              >
                {user.fullName}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap', 
                gap: 3,
                color: 'rgba(255,255,255,0.8)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 18, color: '#5878ed' }} />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 18, color: '#5878ed' }} />
                  <Typography variant="body2">{user.phone || 'Chưa cập nhật'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1, fontSize: 18, color: '#5878ed' }} />
                  <Typography variant="body2">{user.address || 'Chưa cập nhật'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Thanh tìm kiếm */}
        <Box sx={{ mb: 3 }}>
        <TextField
            placeholder="Tìm kiếm theo mã booking, phim, trạng thái, ghế, combo..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                </InputAdornment>
            ),
            sx: { 
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#fff',
                '& fieldset': { border: '1px solid rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2) !important' },
                '&.Mui-focused fieldset': { borderColor: '#5878ed !important' }
            }
            }}
            sx={{ input: { color: 'white' } }}
        />
        </Box>

        {/* Bảng booking */}
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.03)'
          }}
        >
          {loading ? (
            <Box textAlign="center" p={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <CircularProgress size={60} thickness={4} sx={{ color: '#5878ed' }} />
            </Box>
          ) : (
            <Fade in={!loading} timeout={1000}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Mã Booking
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Ngày đặt
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Phim
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Rạp
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Phòng
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Ghế
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Đồ ăn
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Trạng thái
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: '#fff'
                      }}>
                        Số tiền
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking, index) => {
                        const statusStyle = getStatusColor(booking.status);
                        
                        return (
                          <TableRow 
                            key={booking.bookingId}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              },
                              animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s`,
                              '@keyframes fadeIn': {
                                '0%': {
                                  opacity: 0,
                                  transform: 'translateY(10px)'
                                },
                                '100%': {
                                  opacity: 1,
                                  transform: 'translateY(0)'
                                }
                              },
                              animationFillMode: 'both',
                              borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}
                          >
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ReceiptIcon sx={{ mr: 1, fontSize: 20, color: '#5878ed' }} />
                                {booking.bookingId}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarTodayIcon sx={{ mr: 1, fontSize: 20, color: '#5878ed' }} />
                                {formatDate(booking.bookingDate)}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalMoviesIcon sx={{ mr: 1, fontSize: 20, color: '#5878ed' }} />
                                <Tooltip title={booking.movieTitle} arrow>
                                  <Typography 
                                    sx={{ 
                                      maxWidth: 150,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {booking.movieTitle}
                                  </Typography>
                                </Tooltip>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {booking.theaterName}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {booking.screenNumber}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EventSeatIcon sx={{ mr: 1, fontSize: 20, color: '#5878ed' }} />
                                {booking.seatNames}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FastfoodIcon sx={{ mr: 1, fontSize: 20, color: '#5878ed' }} />
                                <Tooltip title={booking.foodDetails || 'Không có'} arrow>
                                  <Typography
                                    sx={{ 
                                      maxWidth: 150,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {booking.foodDetails || 'Không'}
                                  </Typography>
                                </Tooltip>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={booking.status} 
                                size="small"
                                sx={{ 
                                  backgroundColor: booking.status === 'Success' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                                  color: booking.status === 'Success' ? '#2ecc71' : '#e74c3c',
                                  fontWeight: 'bold',
                                  minWidth: 80
                                }} 
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>
                              {booking.total?.toLocaleString()}₫
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 5, color: 'rgba(255,255,255,0.5)' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
                            <SearchIcon sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6">
                              Không tìm thấy dữ liệu phù hợp
                            </Typography>
                            <Typography variant="body2">
                              Vui lòng thử tìm kiếm với từ khóa khác
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Fade>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default UserBookingList;