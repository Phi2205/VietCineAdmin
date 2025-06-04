import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { Save, ArrowBack } from "@mui/icons-material";

const ScreenForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [screen, setScreen] = useState({
    screenNumber: "",
    totalSeats: "",
    theaterId: "",
  });

  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/theaters")
      .then((res) => setTheaters(res.data))
      .catch((err) => {
        console.error("Error fetching theaters:", err);
        toast.error("Không thể tải danh sách rạp.");
      });

    if (id) {
      axios
        .get(`http://localhost:8080/api/admin/screens/${id}`)
        .then((res) => {
          const data = res.data;
          setScreen({
            screenNumber: data.screenNumber?.toString() || "",
            totalSeats: data.totalSeats?.toString() || "",
            theaterId: data.theater?.id || "",
          });
        })
        .catch((err) => {
          console.error("Error fetching screen:", err);
          toast.error("Không thể tải thông tin phòng chiếu.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScreen((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const screenNumber = screen.screenNumber.trim();
    const totalSeats = parseInt(screen.totalSeats, 10);

    if (!screen.theaterId) {
      toast.error("Vui lòng chọn rạp chiếu.");
      return;
    }

    const screenToSubmit = {
      theaterId: screen.theaterId,
      screenNumber,
      totalSeats: isNaN(Number(totalSeats)) ? 0 : Number(totalSeats),
    };

    const request = id
      ? axios.put(
          `http://localhost:8080/api/admin/screens/${id}`,
          screenToSubmit
        )
      : axios.post(`http://localhost:8080/api/admin/screens`, screenToSubmit);

    request
      .then((res) => {
        toast.success(res.data.message || "Lưu phòng chiếu thành công");
        navigate("/screens");
      })
      .catch((err) => {
        console.error("Error saving screen:", err);
        toast.error(err.response?.data?.message || "Lỗi khi lưu phòng chiếu");
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          backgroundColor: "#1a1a1a",
          color: "#E0E0E0",
          border: "1px solid #7f5af0",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
          sx={{ color: "#7f5af0" }}
        >
          {id ? "Chỉnh sửa phòng chiếu" : "Thêm phòng chiếu mới"}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                select
                label="Rạp chiếu"
                name="theaterId"
                value={screen.theaterId}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ style: { color: "#CCCCCC" } }}
                InputProps={{ style: { color: "#E0E0E0" } }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#2a2a2a",
                        color: "#e0e0e0",
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#7f5af0" },
                    "&:hover fieldset": { borderColor: "#9e8cfb" },
                    "&.Mui-focused fieldset": { borderColor: "#2cb67d" },
                  },
                }}
              >
                {theaters.map((theater) => (
                  <MenuItem
                    key={theater.id}
                    value={theater.id}
                    sx={{
                      backgroundColor: "#2a2a2a",
                      color: "#e0e0e0",
                      "&:hover": {
                        backgroundColor: "#3c3c3c",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#7f5af0",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#9e8cfb",
                        },
                      },
                    }}
                  >
                    {theater.name} - {theater.city}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Phòng số"
                name="screenNumber"
                type="text"
                value={screen.screenNumber}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: "#CCCCCC",
                    "&.Mui-focused": {
                      color: "#2cb67d", // màu label khi focus
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    color: "#E0E0E0",
                    backgroundColor: "#1a1a1a", // nền input
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#7f5af0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9e8cfb",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2cb67d",
                    },
                  },
                }}
              />

              <TextField
                label="Số ghế"
                name="totalSeats"
                type="number"
                value={screen.totalSeats}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
                InputLabelProps={{ style: { color: "#CCCCCC" } }}
                InputProps={{ style: { color: "#E0E0E0" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#7f5af0" },
                    "&:hover fieldset": { borderColor: "#9e8cfb" },
                    "&.Mui-focused fieldset": { borderColor: "#2cb67d" },
                  },
                }}
              />

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                mt={2}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate("/screens")}
                  sx={{ color: "#ccc", borderColor: "#7f5af0" }}
                >
                  Thoát
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  sx={{
                    background: "linear-gradient(to right, #7f5af0, #2cb67d)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(to right, #9e8cfb, #3ecf8e)",
                    },
                  }}
                >
                  {id ? "Cập nhật" : "Thêm phòng chiếu"}
                </Button>
              </Stack>
            </Stack>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ScreenForm;
