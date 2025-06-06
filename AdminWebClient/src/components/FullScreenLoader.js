import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const FullScreenLoader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={60} thickness={5} sx={{ color: '#FF5E62' }} />
      <Typography
        variant="h6"
        sx={{
          color: '#e0e0e0',
          mt: 2,
          fontWeight: 500,
          textShadow: '0 0 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        Đang tải dữ liệu, vui lòng đợi...
      </Typography>
    </Box>
  );
};

export default FullScreenLoader;

