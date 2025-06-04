import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Add,
  Edit,
  Delete,
  Search,
  MovieFilter,
  EventSeat,
  AccessTime,
  Movie,
  Theaters,
  CalendarMonth,
  Clear,
  FilterList,
} from "@mui/icons-material";

const ShowtimeList = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState(null);

  useEffect(() => {
    fetchShowtimes();
  }, []);

  useEffect(() => {
    let filtered = showtimes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (showtime) =>
          showtime.movieTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          showtime.theaterName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((showtime) => {
        const showtimeDate = new Date(showtime.startTime);
        return showtimeDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredShowtimes(filtered);
  }, [showtimes, searchTerm, dateFilter]);

  const fetchShowtimes = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/admin/showtimes")
      .then((response) => {
        setShowtimes(response.data);
        setFilteredShowtimes(response.data);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Error fetching showtimes"
        );
      })
      .finally(() => setLoading(false));
  };

  const confirmDelete = (showtime) => {
    setShowtimeToDelete(showtime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (showtimeToDelete) {
      axios
        .delete(
          `http://localhost:8080/api/admin/showtimes/${showtimeToDelete.id}`
        )
        .then(() => {
          setShowtimes((prev) =>
            prev.filter((showtime) => showtime.id !== showtimeToDelete.id)
          );
          toast.success("Showtime deleted successfully");
          setDeleteDialogOpen(false);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Error deleting showtime"
          );
        });
    }
  };

  const getGradientColor = (title) => {
    const colors = [
      "linear-gradient(135deg, #FF6B6B, #4ECDC4)",
      "linear-gradient(135deg, #667eea, #764ba2)",
      "linear-gradient(135deg, #f093fb, #f5576c)",
      "linear-gradient(135deg, #4facfe, #00f2fe)",
      "linear-gradient(135deg, #43e97b, #38f9d7)",
      "linear-gradient(135deg, #fa709a, #fee140)",
    ];
    const index = title.length % colors.length;
    return colors[index];
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Stats calculation
  const totalMovies = new Set(showtimes.map((showtime) => showtime.movieTitle))
    .size;
  const totalTheaters = new Set(
    showtimes.map((showtime) => showtime.theaterName)
  ).size;
  const upcomingShowtimes = showtimes.filter(
    (showtime) => new Date(showtime.startTime) > new Date()
  ).length;

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#0a0e1a",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, #1a1d29 0%, #2d1b69 50%, #11998e 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
            transform: "translate(30%, -60%)",
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="white"
              sx={{
                display: "flex",
                alignItems: "center",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              <MovieFilter sx={{ mr: 1.5, fontSize: 35 }} />
              Quản lý Lịch Chiếu Phim
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mt: 0.5, color: "rgba(255,255,255,0.7)" }}
            >
              Quản lý và theo dõi lịch chiếu phim tại các rạp
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/showtimes/add"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backdropFilter: "blur(10px)",
              color: "white",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
              px: 3,
              py: 1,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "&:hover": {
                background: "linear-gradient(45deg, #764ba2, #667eea)",
                boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Thêm Lịch Chiếu
          </Button>
        </Stack>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#1a1d29",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
              },
            }}
          >
            <Box
              sx={{
                height: 7,
                background: "linear-gradient(90deg, #FF6B6B, #4ECDC4)",
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)",
                    width: 60,
                    height: 60,
                    boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
                  }}
                >
                  <Movie sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {totalMovies}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.6)">
                    Lịch chiếu phim
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#1a1d29",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(102, 126, 234, 0.3)",
              },
            }}
          >
            <Box
              sx={{
                height: 7,
                background: "linear-gradient(90deg, #667eea, #764ba2)",
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    width: 60,
                    height: 60,
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <Theaters sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {totalTheaters}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.6)">
                    Active Theaters
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid> */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#1a1d29",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(67, 233, 123, 0.3)",
              },
            }}
          >
            <Box
              sx={{
                height: 7,
                background: "linear-gradient(90deg, #43e97b, #38f9d7)",
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                    width: 60,
                    height: 60,
                    boxShadow: "0 8px 25px rgba(67, 233, 123, 0.3)",
                  }}
                >
                  <CalendarMonth sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {upcomingShowtimes}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.6)">
                    Số lịch Chiếu Sắp Tới
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          bgcolor: "#1a1d29",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            border: "1px solid rgba(102, 126, 234, 0.3)",
          },
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Search by Title/Theater */}
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Search sx={{ mr: 1.5, color: "#667eea" }} />
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên phim hoặc rạp"
              variant="standard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "1.1rem",
                  color: "white",
                  "& input::placeholder": {
                    color: "rgba(255, 255, 255, 0.5)",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          {/* Date Filter */}
          {/* <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarMonth sx={{ mr: 1.5, color: "#43e97b" }} />
              <TextField
                fullWidth
                type="date"
                variant="standard"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: "1rem",
                    color: "white",
                    "& input": {
                      color: "white",
                    },
                  },
                }}
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: "invert(1)",
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
          </Grid> */}

          {/* Clear Filters */}
          {/* <Grid item xs={12} md={2}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Clear />}
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("");
                }}
                disabled={!searchTerm && !dateFilter}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                  "&:disabled": {
                    color: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Clear
              </Button>
            </Stack>
          </Grid> */}
        </Grid>

        {/* Active Filters Display */}
        {/* {(searchTerm || dateFilter) && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              color="rgba(255, 255, 255, 0.6)"
              sx={{ mb: 1 }}
            >
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  size="small"
                  onDelete={() => setSearchTerm("")}
                  sx={{
                    bgcolor: "rgba(102, 126, 234, 0.2)",
                    color: "#667eea",
                    "& .MuiChip-deleteIcon": {
                      color: "#667eea",
                    },
                  }}
                />
              )}
              {dateFilter && (
                <Chip
                  label={`Date: ${new Date(dateFilter).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}`}
                  size="small"
                  onDelete={() => setDateFilter("")}
                  sx={{
                    bgcolor: "rgba(67, 233, 123, 0.2)",
                    color: "#43e97b",
                    "& .MuiChip-deleteIcon": {
                      color: "#43e97b",
                    },
                  }}
                />
              )}
            </Stack>
          </Box>
        )} */}
      </Paper>
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          bgcolor: "#1a1d29",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            border: "1px solid rgba(102, 126, 234, 0.3)",
          },
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Date Filter */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarMonth sx={{ mr: 1.5, color: "#43e97b" }} />
              <TextField
                fullWidth
                type="date"
                variant="standard"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: "1rem",
                    color: "white",
                    "& input": {
                      color: "white",
                    },
                  },
                }}
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: "invert(1)",
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={12} md={2}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Clear />}
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("");
                }}
                disabled={!searchTerm && !dateFilter}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                  "&:disabled": {
                    color: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Xóa Bộ Lọc
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {(searchTerm || dateFilter) && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              color="rgba(255, 255, 255, 0.6)"
              sx={{ mb: 1 }}
            >
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  size="small"
                  onDelete={() => setSearchTerm("")}
                  sx={{
                    bgcolor: "rgba(102, 126, 234, 0.2)",
                    color: "#667eea",
                    "& .MuiChip-deleteIcon": {
                      color: "#667eea",
                    },
                  }}
                />
              )}
              {dateFilter && (
                <Chip
                  label={`Date: ${new Date(dateFilter).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}`}
                  size="small"
                  onDelete={() => setDateFilter("")}
                  sx={{
                    bgcolor: "rgba(67, 233, 123, 0.2)",
                    color: "#43e97b",
                    "& .MuiChip-deleteIcon": {
                      color: "#43e97b",
                    },
                  }}
                />
              )}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Content */}
      {loading ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress size={60} thickness={5} sx={{ color: "#667eea" }} />
          <Typography variant="h6" color="rgba(255, 255, 255, 0.6)" mt={2}>
            Tải dữ liệu lịch chiếu...
          </Typography>
        </Box>
      ) : filteredShowtimes.length === 0 ? (
        <Fade in={!loading}>
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "#1a1d29",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <MovieFilter
              sx={{ fontSize: 80, color: "rgba(255, 255, 255, 0.3)", mb: 3 }}
            />
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="white"
            >
              Không có lịch chiếu nào
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.6)">
              {searchTerm || dateFilter
                ? "No showtimes match your search criteria. Try adjusting your filters."
                : "Please adjust your search or add new showtimes"}
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Fade in={!loading}>
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#1a1d29",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <List sx={{ p: 0 }}>
              {filteredShowtimes.map((showtime, index) => (
                <React.Fragment key={showtime.id}>
                  <ListItem
                    sx={{
                      py: 2.5,
                      px: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        "& .MuiButton-root": { opacity: 1 },
                        // transform: "translateX(8px)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background: getGradientColor(showtime.movieTitle),
                          width: 50,
                          height: 50,
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          border: "2px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {showtime.movieTitle.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 0.5, color: "white" }}
                        >
                          {showtime.movieTitle}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Theaters
                                  sx={{ color: "#fa709a", fontSize: 18 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="rgba(255, 255, 255, 0.7)"
                                >
                                  <strong style={{ color: "white" }}>
                                    Rạp chiếu:
                                  </strong>{" "}
                                  {showtime.theaterName}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <EventSeat
                                  sx={{ color: "#4facfe", fontSize: 18 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="rgba(255, 255, 255, 0.7)"
                                >
                                  <strong style={{ color: "white" }}>
                                    Phòng chiếu:
                                  </strong>{" "}
                                  {showtime.screenNumber}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AccessTime
                                  sx={{ color: "#43e97b", fontSize: 18 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="rgba(255, 255, 255, 0.7)"
                                >
                                  <strong style={{ color: "white" }}>
                                    Start:
                                  </strong>{" "}
                                  {formatDateTime(showtime.startTime)}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AccessTime
                                  sx={{ color: "#FF6B6B", fontSize: 18 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="rgba(255, 255, 255, 0.7)"
                                >
                                  <strong style={{ color: "white" }}>
                                    Kết thúc:
                                  </strong>{" "}
                                  {formatDateTime(showtime.endTime)}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>

                          {new Date(showtime.startTime) > new Date() && (
                            <Chip
                              label="Upcoming"
                              size="small"
                              sx={{
                                mt: 1,
                                fontWeight: "medium",
                                background:
                                  "linear-gradient(45deg, #43e97b, #38f9d7)",
                                color: "white",
                                borderRadius: "12px",
                                boxShadow: "0 4px 15px rgba(67, 233, 123, 0.3)",
                              }}
                            />
                          )}
                        </Box>
                      }
                      sx={{ mr: 8 }}
                    />

                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<Edit />}
                          component={Link}
                          to={`/showtimes/edit/${showtime.id}`}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            px: 2,
                            background: "rgba(102, 126, 234, 0.1)",
                            color: "#667eea",
                            borderColor: "rgba(102, 126, 234, 0.3)",
                            opacity: 0.8,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(102, 126, 234, 0.2)",
                              borderColor: "#667eea",
                              transform: "scale(1.05)",
                              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                            },
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => confirmDelete(showtime)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            px: 2,
                            background: "rgba(255, 107, 107, 0.1)",
                            color: "#FF6B6B",
                            borderColor: "rgba(255, 107, 107, 0.3)",
                            opacity: 0.8,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 107, 107, 0.2)",
                              borderColor: "#FF6B6B",
                              transform: "scale(1.05)",
                              boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
                            },
                          }}
                        >
                          Xóa
                        </Button>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredShowtimes.length - 1 && (
                    <Divider
                      component="li"
                      sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Fade>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#1a1d29",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="white">
            Xác nhận Xóa Lịch Chiếu
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Bạn có chắc chắn muốn xóa lịch chiếu "
            {showtimeToDelete?.movieTitle}" tại {showtimeToDelete?.theaterName}?
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              color: "rgba(255, 255, 255, 0.7)",
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                bgcolor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg, #FF6B6B, #ff4757)",
              "&:hover": {
                background: "linear-gradient(45deg, #ff4757, #FF6B6B)",
              },
            }}
          >
            Delete Showtime
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          backgroundColor: "#1a1d29",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      />
    </Box>
  );
};

export default ShowtimeList;
