import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, CircularProgress, Grid,
  TextField, Button, MenuItem, Card, CardContent, Divider,
  IconButton, Tooltip, Fade, useTheme, Chip, Stack,
  List, ListItem, ListItemText, ListItemIcon, Menu,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  InputAdornment, alpha
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { differenceInDays, parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip as ChartTooltip, Legend
} from 'chart.js';
import {
  FilterAlt, Refresh, TrendingUp,
  LocalMovies, TheaterComedy, DateRange,
  KeyboardArrowDown, Search, Close, FormatListBulleted,
  PieChart, BarChart, ShowChart, MovieFilter, ArrowUpward, 
  ArrowDownward, Analytics, Dashboard as DashboardIcon
} from '@mui/icons-material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Component RevenueList tích hợp sẵn với tìm kiếm và sắp xếp
const RevenueList = ({ data }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!data || !data.details || !data.details.length) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatListBulleted />
          Không có dữ liệu doanh thu để hiển thị
        </Typography>
      </Paper>
    );
  }

  const formatMoney = (amount) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);

  const parseLabel = (label) => {
    const parts = label.split(' - ');
    return {
      movie: parts[0] || '',
      theater: parts[1] || ''
    };
  };

  // Hàm sắp xếp
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Lọc và sắp xếp dữ liệu
  const filteredItems = data.details
    .map((item, index) => {
      const { movie, theater } = parseLabel(item.label);
      return {
        id: index,
        movie,
        theater,
        amount: item.amount
      };
    })
    .filter(item => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        item.movie.toLowerCase().includes(searchLower) ||
        item.theater.toLowerCase().includes(searchLower) ||
        formatMoney(item.amount).toLowerCase().includes(searchLower)
      );
    });

  // Sắp xếp dữ liệu
  if (sortConfig.key) {
    filteredItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Tính tổng doanh thu của các item được lọc
  const filteredTotal = filteredItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          color: theme.palette.primary.main
        }}>
          <FormatListBulleted sx={{ mr: 1 }} />
          Chi tiết doanh thu
        </Typography>
        <Chip
          label={`Tổng cộng: ${formatMoney(data.totalRevenue)}`}
          color="primary"
          sx={{
            fontWeight: 600,
            borderRadius: '8px',
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      </Box>

      <TextField
        size="small"
        placeholder="Tìm kiếm theo tên phim, rạp..."
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ 
          mb: 2,
          '& .MuiInputBase-root': {
            borderRadius: '12px',
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchTerm('')}>
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ mb: 2 }} />

      <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: alpha('#f5f5f5', 0.8) } }}>
              <TableCell>STT</TableCell>
              <TableCell 
                onClick={() => requestSort('movie')} 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Phim 
                  {sortConfig.key === 'movie' && (
                    sortConfig.direction === 'asc' ? 
                    <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : 
                    <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => requestSort('theater')} 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Rạp 
                  {sortConfig.key === 'theater' && (
                    sortConfig.direction === 'asc' ? 
                    <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : 
                    <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                align="right" 
                onClick={() => requestSort('amount')} 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  Doanh thu 
                  {sortConfig.key === 'amount' && (
                    sortConfig.direction === 'asc' ? 
                    <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : 
                    <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: alpha('#f5f5f5', 0.5),
                  },
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                  }
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{item.movie}</TableCell>
                <TableCell>{item.theater}</TableCell>
                <TableCell align="right">
                  <Typography
                    fontWeight={600}
                    color="#4caf50"
                  >
                    {formatMoney(item.amount)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy kết quả phù hợp
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {searchTerm && filteredItems.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'right', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" fontWeight={500} color={theme.palette.text.secondary}>
            Tổng doanh thu đã lọc: <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{formatMoney(filteredTotal)}</span>
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Component RevenueForm chính
const RevenueForm = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [theaterId, setTheaterId] = useState('');
  const [movieId, setMovieId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);

  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [movieAnchorEl, setMovieAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const movieMenuOpen = Boolean(movieAnchorEl);

  // Màu sắc theo yêu cầu - giữ màu đậm nổi bật cho các thẻ thống kê
  const cardColors = {
    totalRevenue: {
      bg: '#0b3d0b', // Dark green
      color: '#4caf50', // Bright green
      icon: '#4caf50',
      text: '#4caf50'
    },
    topTheater: {
      bg: '#663d00', // Dark orange
      color: '#ff9800', // Bright orange
      icon: '#ff9800',
      text: '#ff9800'
    },
    topMovie: {
      bg: '#0a3055', // Dark blue
      color: '#2196f3', // Bright blue
      icon: '#2196f3',
      text: '#2196f3'
    },
    dateRange: {
      bg: '#4a1b5d', // Dark purple
      color: '#9c27b0', // Bright purple
      icon: '#ba68c8',
      text: '#ba68c8'
    }
  };

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/theaters`);
        const theaterData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.data || [];
        setTheaters(theaterData);
      } catch (err) {
        console.error('Error fetching theaters:', err);
        toast.error('Lỗi khi tải danh sách rạp');
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/movies`);
        const movieData = response.data?.data || [];
        setMovies(movieData);
      } catch (err) {
        console.error('Error fetching movies:', err);
        toast.error('Lỗi khi tải danh sách phim');
      }
    };

    fetchTheaters();
    fetchMovies();
    
    // Tự động tải dữ liệu khi component được mount
    setTimeout(() => {
      if (!filterApplied) {
        fetchRevenue();
        setFilterApplied(true);
      }
    }, 500);
  }, []);

  const fetchRevenue = async () => {
    setLoading(true);
    
    const filter = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      theaterId: theaterId ? parseInt(theaterId) : null,
      movieId: movieId ? parseInt(movieId) : null
    };

    try {
      const res = await axios.post(`${API_URL}/revenue/by-all`, filter);
      setData(res.data);
      toast.success('Tải dữ liệu doanh thu thành công');
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu doanh thu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    setEndDate(new Date());
    setTheaterId('');
    setMovieId('');
    setTimeout(() => {
      fetchRevenue();
    }, 100);
  };

  const generateChartData = () => {
    if (!data?.details?.length) return null;

    const backgroundColor = data.details.map((_, index) => {
      const hue = (index * 37) % 360; // Use golden ratio for color distribution
      return `hsla(${hue}, 85%, 65%, 0.8)`;
    });

    return {
      labels: data.details.map(item => {
        // Shorten long labels and reorder to show theater first
        const { movie, theater } = parseLabel(item.label);
        const label = `${theater} - ${movie}`; // Theater first, then movie
        return label.length > 25 ? label.substring(0, 23) + '...' : label;
      }),
      datasets: [{
        label: 'Doanh thu (VND)',
        data: data.details.map(item => item.amount),
        backgroundColor,
        borderColor: backgroundColor.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 30,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            family: theme.typography.fontFamily,
            weight: 500
          }
        }
      },
      title: { 
        display: false
      },
      tooltip: {
        backgroundColor: alpha('#000', 0.8),
        titleFont: {
          family: theme.typography.fontFamily,
          size: 13
        },
        bodyFont: {
          family: theme.typography.fontFamily,
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency', currency: 'VND', 
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha('#000', 0.1),
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 11
          },
          padding: 8,
          callback: value => new Intl.NumberFormat('vi-VN', {
            notation: 'compact', 
            compactDisplay: 'short',
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
          }).format(value)
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 11
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 8,
          autoSkip: true,
          maxTicksLimit: 15
        }
      }
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);

  // Tính khoảng thời gian chính xác
  const calculateDateRange = () => {
    // +1 vì chênh lệch ngày là inclusive (tính cả ngày đầu và ngày cuối)
    return differenceInDays(endDate, startDate) + 1;
  };

  // Calculate quick stats
  const getQuickStats = () => {
    if (!data?.details?.length) return [];

    // Get top movie
    const movieRevenues = {};
    data.details.forEach(item => {
      const { movie } = parseLabel(item.label);
      if (!movieRevenues[movie]) movieRevenues[movie] = 0;
      movieRevenues[movie] += item.amount;
    });
    const topMovie = Object.entries(movieRevenues)
      .sort((a, b) => b[1] - a[1])[0];

    // Get top theater
    const theaterRevenues = {};
    data.details.forEach(item => {
      const { theater } = parseLabel(item.label);
      if (!theaterRevenues[theater]) theaterRevenues[theater] = 0;
      theaterRevenues[theater] += item.amount;
    });
    const topTheater = Object.entries(theaterRevenues)
      .sort((a, b) => b[1] - a[1])[0];

    // Tính số ngày chính xác
    const dateRangeCount = calculateDateRange();

    return [
      {
        title: 'Tổng doanh thu',
        value: formatMoney(data.totalRevenue),
        icon: <ShowChart />,
        colorSet: cardColors.totalRevenue
      },
      {
        title: 'Rạp doanh thu cao nhất',
        value: topTheater ? formatMoney(topTheater[1]) : 'N/A',
        subtitle: topTheater ? topTheater[0] : '',
        icon: <TheaterComedy />,
        colorSet: cardColors.topTheater
      },
      {
        title: 'Phim doanh thu cao nhất',
        value: topMovie ? formatMoney(topMovie[1]) : 'N/A',
        subtitle: topMovie ? topMovie[0] : '',
        icon: <LocalMovies />,
        colorSet: cardColors.topMovie
      },
      {
        title: 'Khoảng thời gian',
        value: `${dateRangeCount} ngày`,
        subtitle: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        icon: <DateRange />,
        colorSet: cardColors.dateRange
      }
    ];
  };

  const parseLabel = (label) => {
    const parts = label.split(' - ');
    return {
      movie: parts[0] || '',
      theater: parts[1] || ''
    };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFilterDescription = () => {
    const theaterName = theaterId ? theaters.find(t => t.id == theaterId)?.name || '' : 'Tất cả rạp';
    const movieTitle = movieId ? movies.find(m => (m.movieId || m.id) == movieId)?.title || 'Đã chọn phim' : 'Tất cả phim';

    return (
      <Box sx={{ mt: 1, mb: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={`Thời gian: ${formatDate(startDate)} → ${formatDate(endDate)}`}
            variant="outlined"
            size="small"
            icon={<DateRange fontSize="small" />}
            sx={{ 
              borderRadius: '8px',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              '& .MuiChip-label': { px: 1 }
            }}
          />
          <Chip
            label={`Rạp: ${theaterName}`}
            variant="outlined"
            size="small"
            icon={<TheaterComedy fontSize="small" />}
            sx={{ 
              borderRadius: '8px',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              '& .MuiChip-label': { px: 1 }
            }}
          />
          <Chip
            label={`Phim: ${movieTitle}`}
            variant="outlined"
            size="small"
            icon={<LocalMovies fontSize="small" />}
            sx={{ 
              borderRadius: '8px',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Stack>
      </Box>
    );
  };

  const chartData = generateChartData();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          p: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
        }}
      >
        <DashboardIcon sx={{ fontSize: 40, mr: 2, color: '#fff' }} />
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Dashboard Quản Lý Doanh Thu
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: alpha('#fff', 0.85),
              fontWeight: 500
            }}
          >
            Phân tích doanh thu theo rạp, phim và thời gian
          </Typography>
        </Box>
      </Box>

      {/* Filter Panel */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.primary.main
          }}
        >
          <FilterAlt sx={{ mr: 1 }} /> 
          Bộ lọc doanh thu
        </Typography>
        
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2.5}>
              <DatePicker
                label="Từ ngày"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
                maxDate={endDate}
                sx={{ 
                  width: '100%',
                  '& .MuiInputBase-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2.5}>
              <DatePicker
                label="Đến ngày"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
                minDate={startDate}
                sx={{ 
                  width: '100%',
                  '& .MuiInputBase-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </Grid>
            
            {/* Dropdown chọn rạp */}
            <Grid item xs={12} md={2.5}>
              <Button
                variant="outlined"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                fullWidth
                startIcon={<TheaterComedy />}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  borderRadius: '12px',
                  minWidth: 200,
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: '55px',
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                {theaterId
                  ? theaters.find(t => t.id == theaterId)?.name || 'Chọn rạp'
                  : 'Tất cả rạp'}
              </Button>
              <Menu 
                anchorEl={anchorEl} 
                open={open} 
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  style: {
                    maxHeight: 300,
                    width: 250,
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                  sx: {
                    '& .MuiList-root': {
                      p: 1
                    },
                    '& .MuiMenuItem-root': {
                      borderRadius: '8px',
                      mb: 0.5
                    }
                  }
                }}
              >
                <MenuItem 
                  onClick={() => { setTheaterId(''); setAnchorEl(null); }}
                  sx={{ 
                    py: 1.2,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                  }}
                >
                  <ListItemIcon><TheaterComedy fontSize="small" sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                  <ListItemText 
                    primary="Tất cả rạp"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {theaters.map(theater => (
                  <MenuItem key={theater.id} 
                    onClick={() => {
                      setTheaterId(theater.id.toString());
                      setAnchorEl(null);
                    }}
                    sx={{ 
                      py: 1,
                      bgcolor: theaterId === theater.id.toString() ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
                    }}
                  >
                    <ListItemIcon><TheaterComedy fontSize="small" sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                    <ListItemText 
                      primary={theater.name}
                      primaryTypographyProps={{ fontWeight: theaterId === theater.id.toString() ? 600 : 400 }}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Grid>

            {/* Dropdown chọn phim */}
            <Grid item xs={12} md={2.5}>
              <Button
                variant="outlined"
                onClick={(e) => setMovieAnchorEl(e.currentTarget)}
                fullWidth
                startIcon={<MovieFilter />}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  borderRadius: '12px',
                  minWidth: 200,
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: '55px',
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                {movieId
                  ? movies.find(m => (m.movieId || m.id).toString() === movieId)?.title || 'Chọn phim'
                  : 'Tất cả phim'}
              </Button>
              <Menu 
                anchorEl={movieAnchorEl} 
                open={movieMenuOpen} 
                onClose={() => setMovieAnchorEl(null)}
                PaperProps={{
                  style: {
                    maxHeight: 300,
                    width: 250,
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                  sx: {
                    '& .MuiList-root': {
                      p: 1
                    },
                    '& .MuiMenuItem-root': {
                      borderRadius: '8px',
                      mb: 0.5
                    }
                  }
                }}
              >
                <MenuItem 
                  onClick={() => { setMovieId(''); setMovieAnchorEl(null); }}
                  sx={{ 
                    py: 1.2,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                  }}
                >
                  <ListItemIcon><MovieFilter fontSize="small" sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                  <ListItemText 
                    primary="Tất cả phim" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {movies.map(movie => (
                  <MenuItem 
                    key={movie.movieId || movie.id} 
                    onClick={() => {
                      setMovieId((movie.movieId || movie.id).toString());
                      setMovieAnchorEl(null);
                    }}
                    sx={{ 
                      py: 1,
                      bgcolor: movieId === (movie.movieId || movie.id).toString() ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
                    }}
                  >
                    <ListItemIcon><MovieFilter fontSize="small" sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                    <ListItemText 
                      primary={movie.title}
                      primaryTypographyProps={{ fontWeight: movieId === (movie.movieId || movie.id).toString() ? 600 : 400 }}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  onClick={fetchRevenue} 
                  fullWidth
                  startIcon={<FilterAlt />}
                  sx={{
                    borderRadius: '12px',
                    height: '55px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
                    }
                  }}
                >
                  Lọc doanh thu
                </Button>
                <Tooltip title="Đặt lại bộ lọc">
                  <IconButton 
                    onClick={resetFilters} 
                    color="secondary"
                    sx={{
                      height: 55,
                      width: 55,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.secondary.main, 0.2),
                      },
                      borderRadius: '12px'
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>

        {data && getFilterDescription()}
      </Paper>

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: 400,
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body1" color="text.secondary">Đang tải dữ liệu doanh thu...</Typography>
        </Box>
      ) : data && (
        <>
          {/* Quick Stats Cards */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              {getQuickStats().map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        borderRadius: 3,
                        backgroundColor: stat.colorSet.bg,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15)`,
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600,
                              color: alpha(stat.colorSet.color, 0.8)
                            }}
                          >
                            {stat.title}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex',
                            color: stat.colorSet.icon
                          }}>
                            {stat.icon}
                          </Box>
                        </Box>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 0.5,
                            color: stat.colorSet.text
                          }}
                        >
                          {stat.value}
                        </Typography>
                        {stat.subtitle && (
                          <Typography 
                            variant="body2" 
                            noWrap 
                            title={stat.subtitle}
                            sx={{ 
                              fontWeight: 500,
                              color: alpha(stat.colorSet.color, 0.7)
                            }}
                          >
                            {stat.subtitle}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Charts and Data Table */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            {/* Chart */}
            <Paper 
              elevation={2} 
              sx={{ 
                flex: 1, 
                minWidth: { xs: '100%', md: 400 }, 
                height: 500, 
                p: 3,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.palette.primary.main
                }}
              >
                <BarChart sx={{ mr: 1 }} />
                Biểu đồ phân tích doanh thu
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {chartData ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Không có dữ liệu để hiển thị</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
            
            {/* Revenue List */}
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 400 } }}>
              <RevenueList data={data} />
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default RevenueForm;