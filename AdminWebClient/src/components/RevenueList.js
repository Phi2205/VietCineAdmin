import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Paper,
  Divider, InputAdornment, TableSortLabel, Chip,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Tooltip, alpha, Card, CardContent
} from '@mui/material';
import { 
  Search, Sort, MoreVert,
  ArrowDropDown, ArrowDropUp,
  AttachMoney, LocalMovies, TheaterComedy
} from '@mui/icons-material';

const RevenueList = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'amount',
    direction: 'desc',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!data?.details) return;
    
    let filteredData = [...data.details].map((item, index) => {
      // Chuyển đổi label thành theater và movie
      const { movie, theater } = parseLabel(item.label);
      return { ...item, movie, theater, id: index };
    });
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        (item.movie && item.movie.toLowerCase().includes(term)) || 
        (item.theater && item.theater.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFiltered(filteredData);
  }, [searchTerm, data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);

  const totalFiltered = filtered.reduce((sum, item) => sum + item.amount, 0);

  // Thay đổi thứ tự trong label để theater đứng trước movie
  const parseLabel = (label) => {
    const parts = label.split(' - ');
    return {
      movie: parts[0] || '',
      theater: parts[1] || ''
    };
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortOption = (key) => {
    handleSort(key);
    handleClose();
  };

  // Get top revenue items
  const getTopRevenues = () => {
    if (!filtered.length) return [];
    
    const sorted = [...filtered].sort((a, b) => b.amount - a.amount);
    return sorted.slice(0, 3);
  };

  const topRevenues = getTopRevenues();
  const hasSearchResults = searchTerm && filtered.length > 0;

  return (
    <Paper 
      elevation={3}
      sx={{ 
        height: 500, 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Chi tiết doanh thu</Typography>
        
        <TextField
          placeholder="Tìm kiếm theo tên rạp hoặc phim..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Tùy chọn sắp xếp">
                  <IconButton
                    size="small"
                    onClick={handleMenuClick}
                    aria-controls={open ? 'sort-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Sort />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="sort-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'sort-button',
                  }}
                >
                  <MenuItem onClick={() => handleSortOption('amount')}>
                    <ListItemIcon>
                      <AttachMoney fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sắp xếp theo doanh thu</ListItemText>
                    {sortConfig.key === 'amount' && (
                      sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                    )}
                  </MenuItem>
                  <MenuItem onClick={() => handleSortOption('theater')}>
                    <ListItemIcon>
                      <TheaterComedy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sắp xếp theo tên rạp</ListItemText>
                    {sortConfig.key === 'theater' && (
                      sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                    )}
                  </MenuItem>
                  <MenuItem onClick={() => handleSortOption('movie')}>
                    <ListItemIcon>
                      <LocalMovies fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sắp xếp theo tên phim</ListItemText>
                    {sortConfig.key === 'movie' && (
                      sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                    )}
                  </MenuItem>
                </Menu>
              </InputAdornment>
            )
          }}
        />

        {hasSearchResults && (
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={`${filtered.length} kết quả cho "${searchTerm}"`} 
              size="small" 
              onDelete={() => setSearchTerm('')}
            />
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filtered.length === 0 ? (
          <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Typography align="center" color="text.secondary">
              Không có dữ liệu phù hợp với tìm kiếm.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ height: '100%' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {/* Đổi thứ tự cột - Rạp đầu tiên */}
                    <TableSortLabel
                      active={sortConfig.key === 'theater'}
                      direction={sortConfig.key === 'theater' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('theater')}
                    >
                      Rạp
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={sortConfig.key === 'movie'}
                      direction={sortConfig.key === 'movie' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('movie')}
                    >
                      Phim
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={sortConfig.key === 'amount'}
                      direction={sortConfig.key === 'amount' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('amount')}
                    >
                      Doanh thu
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item) => {
                  const isTopRevenue = topRevenues.includes(item);
                  const isHovered = hoveredRow === item.id;
                  
                  return (
                    <TableRow 
                      key={item.id}
                      hover
                      onMouseEnter={() => setHoveredRow(item.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      sx={{ 
                        backgroundColor: isTopRevenue ? (theme) => alpha(theme.palette.warning.light, 0.1) : 'inherit',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.1),
                        }
                      }}
                    >
                      {/* Đổi thứ tự cột - Rạp đầu tiên */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TheaterComedy 
                            sx={{ 
                              fontSize: 16, 
                              mr: 1, 
                              color: isTopRevenue ? 'warning.main' : 'secondary.main',
                              opacity: isHovered ? 1 : 0.7,
                            }} 
                          />
                          {item.theater}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalMovies 
                            sx={{ 
                              fontSize: 16, 
                              mr: 1, 
                              color: isTopRevenue ? 'warning.main' : 'primary.main',
                              opacity: isHovered ? 1 : 0.7,
                            }} 
                          />
                          {item.movie}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          sx={{ 
                            fontWeight: isTopRevenue ? 'bold' : 'normal',
                            color: isTopRevenue ? 'warning.dark' : 'text.primary'
                          }}
                        >
                          {formatMoney(item.amount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {filtered.length > 0 && (
        <Card 
          sx={{ 
            m: 2, 
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <CardContent sx={{ p: '8px 16px !important' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                {hasSearchResults
                  ? 'Tổng doanh thu tìm kiếm:'
                  : filtered.length === data.details.length
                    ? 'Tổng doanh thu:'
                    : 'Tổng doanh thu được lọc:'}
              </Typography>
              <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                {formatMoney(totalFiltered)}
              </Typography>
            </Box>
            {hasSearchResults && (
              <Typography variant="caption" color="text.secondary">
                {((totalFiltered / data.totalRevenue) * 100).toFixed(1)}% trên tổng doanh thu
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default RevenueList;