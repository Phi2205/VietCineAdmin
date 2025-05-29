"use client";

import { useEffect, useState, useRef } from "react";
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
  DialogActions,
  Avatar,
  Stack,
  Card,
  CardContent,
  Grid,
  Fade,
  createTheme,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Add, Edit, Search, Person, Close, CloudUpload, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#8e24aa" },
    secondary: { main: "#00bcd4" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff", secondary: "rgba(255, 255, 255, 0.7)" },
  },
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DirectorDialog = ({ open, onClose, onAdd, onUpdate, editingDirector }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (editingDirector) {
        setName(editingDirector.name || "");
        setAvatar(null);
        setAvatarPreview(editingDirector.avatar || null);
      } else {
        setName("");
        setAvatar(null);
        setAvatarPreview(null);
      }
      setNameError(false);
      setAvatarError(false);
      setLoading(false);
    }
  }, [open, editingDirector]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarError(false);
    } else {
      setAvatarError(true);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    }

    if (!avatar && !editingDirector) {
      setAvatarError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (avatar) formData.append("avatar", avatar);
    if (editingDirector) formData.append("id", editingDirector.id);

    try {
      if (editingDirector) {
        await onUpdate(formData);
      } else {
        await onAdd(formData);
      }
      onClose();
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi xử lý");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, bgcolor: "#1e1e1e" } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
        {editingDirector ? "Cập nhật đạo diễn" : "Thêm đạo diễn"}
        <IconButton onClick={onClose} sx={{ color: "#fff" }} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <TextField
          label="Tên đạo diễn"
          fullWidth
          variant="filled"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError && e.target.value.trim()) setNameError(false);
          }}
          error={nameError}
          helperText={nameError ? "Vui lòng nhập tên đạo diễn." : ""}
          sx={{ mb: 3, input: { color: "#fff" }, label: { color: "#aaa" } }}
          disabled={loading}
        />

        <Typography sx={{ mb: 1, color: "#fff" }}>
          Ảnh đại diện {editingDirector ? "(có thể bỏ qua)" : "*"}
        </Typography>

        <Box
          onClick={() => !loading && fileInputRef.current && fileInputRef.current.click()}
          sx={{
            border: "2px dashed",
            borderColor: avatarError ? "#f44336" : "#aaa",
            borderRadius: 2,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            cursor: loading ? "not-allowed" : "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s",
            mb: 2,
            "&:hover": { borderColor: loading ? "#aaa" : "#fff", color: loading ? "#aaa" : "#fff" },
          }}
        >
          {avatarPreview ? (
            <>
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAvatar();
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                }}
                disabled={loading}
              >
                <Delete />
              </IconButton>
            </>
          ) : (
            <Box textAlign="center">
              <CloudUpload fontSize="large" />
              <Typography>Tải lên ảnh đại diện (PNG, JPG - tối đa 2MB)</Typography>
            </Box>
          )}

          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading}
          />
        </Box>

        {avatarError && (
          <Typography color="error" variant="caption">
            Vui lòng chọn ảnh đại diện hợp lệ (PNG, JPG).
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : editingDirector ? "Cập nhật đạo diễn" : "Thêm đạo diễn"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DirectorManagement = () => {
  const [directors, setDirectors] = useState([]);
  const [filteredDirectors, setFilteredDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState(null);

  useEffect(() => {
    fetchDirectors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredDirectors(
        directors.filter(
          (director) =>
            director?.name &&
            director.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredDirectors(directors.filter((director) => director));
    }
  }, [directors, searchTerm]);

  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/admin/directors");
      const validDirectors = response.data.filter(
        (director) => director && director.id && director.name
      );
      setDirectors(validDirectors);
      setFilteredDirectors(validDirectors);
    } catch (error) {
      console.error("Error fetching directors:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu đạo diễn");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDirector = async (formData) => {
    try {
      const response = await axios.post("http://localhost:8080/api/admin/directors", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200 && response.data?.data?.id && response.data?.data?.name) {
        await fetchDirectors();
        toast.success(response.data.message || "Thêm đạo diễn thành công", {
          toastId: "add-director",
        });
      } else {
        throw new Error(response.data?.message || "Dữ liệu đạo diễn không hợp lệ");
      }
    } catch (error) {
      console.error("Error adding director:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi thêm đạo diễn");
    }
  };

  const handleEditDirector = async (formData) => {
    const idDirector = formData.get("id");
    formData.delete("id");

    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/directors/${idDirector}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200 && response.data?.id && response.data?.name) {
        await fetchDirectors();
        toast.success("Cập nhật đạo diễn thành công", {
          toastId: "update-director",
        });
      } else {
        throw new Error("Dữ liệu đạo diễn không hợp lệ");
      }
    } catch (error) {
      console.error("Error updating director:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi cập nhật đạo diễn");
    }
  };

  const totalDirectors = directors.length;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh" }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(45deg, #8e24aa 0%, #00bcd4 100%)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
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
                "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
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
                sx={{ display: "flex", alignItems: "center", textShadow: "0 2px 10px rgba(0,0,0,0.25)" }}
              >
                <Person sx={{ mr: 1.5, fontSize: 35 }} />
                Quản Lý Đạo Diễn
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 0.5, color: "rgba(255,255,255,0.85)" }}>
                Quản lý tất cả đạo diễn trong hệ thống
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingDirector(null);
                setDialogOpen(true);
              }}
              sx={{
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.25)",
                color: "white",
                px: 3,
                "&:hover": { bgcolor: "rgba(0,0,0,0.4)" },
              }}
            >
              Thêm Đạo Diễn Mới
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: "#1e1e1e",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
                "&:hover": { transform: "translateY(-5px)", transition: "transform 0.3s ease" },
              }}
            >
              <Box sx={{ height: 5, bgcolor: "#8e24aa" }} />
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "rgba(142, 36, 170, 0.9)",
                      width: 60,
                      height: 60,
                      boxShadow: "0 4px 14px rgba(142, 36, 170, 0.4)",
                    }}
                  >
                    <Person sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {totalDirectors}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Tổng Đạo Diễn
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 1.5,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                bgcolor: "#1e1e1e",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Search sx={{ mx: 1.5, color: "#8e24aa" }} />
              <TextField
                fullWidth
                placeholder="Tìm kiếm đạo diễn..."
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem" } }}
              />
            </Paper>
          </Grid>
        </Grid>

        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress size={60} thickness={5} sx={{ color: "#8e24aa" }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : filteredDirectors.length === 0 ? (
          <Fade in={!loading}>
            <Paper
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "#1e1e1e",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Person sx={{ fontSize: 80, color: "#666", mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Không tìm thấy đạo diễn
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vui lòng điều chỉnh tìm kiếm hoặc thêm đạo diễn mới
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
                bgcolor: "#1e1e1e",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(142, 36, 170, 0.15)" }}>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", py: 2, width: "20%" }}>
                      Avatar
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "60%" }}>
                      Tên Đạo Diễn
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", fontSize: "1rem", width: "20%" }}
                    >
                      Thao Tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDirectors.map((director) =>
                    director && director.name ? (
                      <TableRow
                        key={director.id}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(142, 36, 170, 0.08)",
                            "& .MuiIconButton-root": { opacity: 1 },
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell>
                          <Avatar
                            src={director.avatar}
                            sx={{ width: 45, height: 45, boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}
                          >
                            {director.name.charAt(0)}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{director.name}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Chỉnh sửa đạo diễn">
                            <IconButton
                              onClick={() => {
                                setEditingDirector(director);
                                setDialogOpen(true);
                              }}
                              sx={{
                                color: "#00bcd4",
                                bgcolor: "rgba(0, 188, 212, 0.1)",
                                opacity: 0.8,
                                "&:hover": {
                                  bgcolor: "rgba(0, 188, 212, 0.2)",
                                  transform: "scale(1.05)",
                                },
                              }}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        )}

        <DirectorDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAdd={handleAddDirector}
          onUpdate={handleEditDirector}
          editingDirector={editingDirector}
        />

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Box>
    </ThemeProvider>
  );
};

export default DirectorManagement;