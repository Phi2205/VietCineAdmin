import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
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
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "./Pagination";
import {
  Add,
  Edit,
  Delete,
  Search,
  MovieFilter,
  CalendarMonth,
  Star,
  AccessTime,
  People,
  Image,
} from "@mui/icons-material";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff5252",
    },
    secondary: {
      main: "#ff9100",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
});

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [posterDialogOpen, setPosterDialogOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredMovies(
        movies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.englishTitle
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            movie.directorName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            movie.genreNames?.some((genre) =>
              genre.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
      );
    } else {
      setFilteredMovies(movies);
    }
  }, [movies, searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8080/api/admin/movies/page?page=${currentPage - 1}&size=5`
      )
      .then((response) => {
        setMovies(response.data.content || []);
        setFilteredMovies(response.data.content || []);
        console.log(response.data);
        console.log("CurrentPage: ", currentPage);
        setTotalPages(response.data.totalPages || 1);
        setTotalMovies(response.data.totalElements || 0);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error fetching movies");
      })
      .finally(() => setLoading(false));
  };

  const confirmDelete = (movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };
  const handleSearch = async() => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/admin/movies/page/title?title=${title}&page=${currentPage - 1}&size=5`
      );
      setMovies(response.data.content || []);
      setFilteredMovies(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalMovies(response.data.totalElements || 0);
      setCurrentPage(1); // Reset to first page on search
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching movies");
    }
    setLoading(false);

  };
  const handleDeleteConfirm = () => {
    if (movieToDelete) {
      axios
        .delete(`http://localhost:8080/api/admin/movies/${movieToDelete.id}`)
        .then(() => {
          setMovies((prev) =>
            prev.filter((movie) => movie.id !== movieToDelete.id)
          );
          toast.success("Movie deleted successfully");
          setDeleteDialogOpen(false);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Error deleting movie");
        });
    }
  };
  const handlePageChange = async (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openPosterDialog = (movie) => {
    setSelectedPoster(movie.posterUrl || null);
    setPosterDialogOpen(true);
  };

  // Stats calculation
  const uniqueGenres = new Set(
    movies.flatMap((movie) => movie.genreNames || [])
  ).size;
  const uniqueDirectors = new Set(movies.map((movie) => movie.directorName))
    .size;

  // Function to generate gradient avatar background color based on movie title
  const getGradientColor = (title) => {
    const colors = [
      "linear-gradient(135deg, #FF9966, #FF5E62)",
      "linear-gradient(135deg, #7F7FD5, #86A8E7, #91EAE4)",
      "linear-gradient(135deg, #43C6AC, #191654)",
      "linear-gradient(135deg, #834d9b, #d04ed6)",
      "linear-gradient(135deg, #4568DC, #B06AB3)",
      "linear-gradient(135deg, #0575E6, #00F260)",
    ];
    const index = title.length % colors.length;
    return colors[index];
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#4CAF50";
    if (rating >= 3) return "#FFC107";
    return "#FF5722";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const defaultPosterUrl = "/placeholder-movie-poster.jpg";

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh" }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(45deg, #1f1c2c 0%, #928dab 100%)",
            boxShadow: "0 6px 20px rgba(255, 94, 98, 0.23)",
            overflow: "hidden",
            position: "relative",
            overflow: "hidden",
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
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
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
                  textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                }}
              >
                <MovieFilter sx={{ mr: 1.5, fontSize: 35 }} />
                Quản lý phim
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mt: 0.5, color: "rgba(255,255,255,0.85)" }}
              >
                Quản lý thông tin phim tại đây
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              component={Link}
              to="/movies/add"
              sx={{
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "#e0e0e0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                px: 3,
                py: 1,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.25)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                },
              }}
            >
              Thêm phim mới
            </Button>
          </Stack>
        </Paper>

        {/* Stats Cards */}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: "#1e1e1e",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  transition: "transform 0.3s ease",
                },
              }}
            >
              <Box sx={{ height: 5, bgcolor: "#FF5252" }} />
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 82, 82, 0.9)",
                      width: 60,
                      height: 60,
                      boxShadow: "0 4px 14px rgba(255, 82, 82, 0.4)",
                    }}
                  >
                    <MovieFilter sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {totalMovies}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#ccc" }}>
                      Tổng số phim
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Search Bar */}
        <Paper
          sx={{
            p: 1.5,
            mb: 4,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 6px 16px rgba(32, 40, 97, 0.1)",
          }}
        >
          <Search sx={{ mx: 1.5, color: "#FF5E62" }} />
          <TextField
            fullWidth
            placeholder="Tìm kiếm phim theo tên, đạo diễn, thể loại..."
            variant="standard"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: "1.1rem" },
            }}
          />
        </Paper>
        <h2 style={{ color: "#ffffff", marginBottom: "12px" }}>
          Tìm kiếm phim theo tên
        </h2>

        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Nhap tên phim..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "10px",
              width: "260px",
              marginRight: "12px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2c2c2c",
              color: "#fff",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 16px",
              backgroundColor: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#6366f1")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4f46e5")}
          >
            Tìm kiếm
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress
              size={60}
              thickness={5}
              sx={{ color: "#FF5E62" }}
            />
            <Typography variant="h6" color="text.secondary" mt={2}>
              Đang tải danh sách phim...
            </Typography>
          </Box>
        ) : filteredMovies.length === 0 ? (
          <Fade in={!loading}>
            <Paper
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 3,
                boxShadow: "0 6px 16px rgba(32, 40, 97, 0.1)",
              }}
            >
              <MovieFilter sx={{ fontSize: 80, color: "#9e9e9e", mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Không tìm thấy phim nào
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vui lòng kiểm tra lại từ khóa hoặc thêm phim mới
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <Fade in={!loading}>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(32, 40, 97, 0.1)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(255, 94, 98, 0.05)" }}>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem", py: 2 }}
                    >
                      Chi tiết phim
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Đạo diễn
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Thể loại
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Lịch phát hành
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Thời lượng
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Đánh giá
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMovies.map((movie) => (
                    <TableRow
                      key={movie.id}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(255, 94, 98, 0.03)",
                          "& .MuiIconButton-root": { opacity: 1 },
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Poster image instead of Avatar */}
                          <Box
                            sx={{
                              width: 45,
                              height: 60,
                              borderRadius: 1,
                              overflow: "hidden",
                              cursor: "pointer",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              position: "relative",
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                            onClick={() => openPosterDialog(movie)}
                          >
                            {movie.posterUrl ? (
                              <img
                                src={movie.posterUrl}
                                alt={`${movie.title} poster`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  height: "100%",
                                  background: getGradientColor(movie.title),
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#e0e0e0",
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {movie.title.charAt(0).toUpperCase()}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box>
                            <Typography fontWeight="bold">
                              {movie.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {movie.englishTitle || "No English Title"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {movie.directorName || "Unknown"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {movie.genreNames &&
                            movie.genreNames.map((genre, index) => (
                              <Chip
                                key={index}
                                label={genre}
                                size="small"
                                sx={{
                                  fontWeight: "medium",
                                  bgcolor: "rgba(255, 94, 98, 0.1)",
                                  color: "#FF5E62",
                                  borderRadius: "12px",
                                  my: 0.5,
                                }}
                              />
                            ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarMonth
                            sx={{ fontSize: 16, color: "#FF9966" }}
                          />
                          <Typography>
                            {formatDate(movie.releaseDate)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTime sx={{ fontSize: 16, color: "#4568DC" }} />
                          <Typography>{movie.duration || "N/A"}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={movie.rating || "N/A"}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            bgcolor: movie.rating
                              ? `${getRatingColor(movie.rating)}20`
                              : "rgba(0, 0, 0, 0.08)",
                            color: movie.rating
                              ? getRatingColor(movie.rating)
                              : "text.secondary",
                            borderRadius: "12px",
                            py: 0.5,
                            px: 1,
                            minWidth: "40px",
                          }}
                          icon={
                            <Star
                              sx={{
                                fontSize: "0.8rem !important",
                                color: "inherit",
                              }}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            movie.isAvailable ? "Available" : "Unavailable"
                          }
                          size="small"
                          sx={{
                            fontWeight: "medium",
                            bgcolor: movie.isAvailable
                              ? "rgba(76, 175, 80, 0.1)"
                              : "rgba(158, 158, 158, 0.1)",
                            color: movie.isAvailable ? "#4CAF50" : "#9E9E9E",
                            borderRadius: "12px",
                            py: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            component={Link}
                            to={`/movies/edit/${movie.id}`}
                            sx={{
                              color: "#FF9966",
                              bgcolor: "rgba(255, 153, 102, 0.1)",
                              opacity: 0.8,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(255, 153, 102, 0.15)",
                                transform: "scale(1.05)",
                              },
                            }}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => confirmDelete(movie)}
                            sx={{
                              color: "#FF5E62",
                              bgcolor: "rgba(255, 94, 98, 0.1)",
                              opacity: 0.8,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "rgba(255, 94, 98, 0.15)",
                                transform: "scale(1.05)",
                              },
                            }}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        )}

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Xác nhận xóa phim
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa phim "
              <strong>{movieToDelete?.title}</strong>" không? Hành đông này sẽ
              không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Thoát
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Xóa phim
            </Button>
          </DialogActions>
        </Dialog>

        {/* Poster Dialog */}
        <Dialog
          open={posterDialogOpen}
          onClose={() => setPosterDialogOpen(false)}
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              p: 0,
            },
          }}
        >
          {selectedPoster ? (
            <Box sx={{ position: "relative" }}>
              <img
                src={selectedPoster}
                alt="Movie poster"
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <IconButton
                onClick={() => setPosterDialogOpen(false)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "#e0e0e0",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <Box sx={{ fontSize: 18, fontWeight: "bold" }}>✕</Box>
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <Image sx={{ fontSize: 80, color: "rgba(0,0,0,0.2)", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No poster available
              </Typography>
              <Button onClick={() => setPosterDialogOpen(false)} sx={{ mt: 3 }}>
                Close
              </Button>
            </Box>
          )}
        </Dialog>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MovieList;
