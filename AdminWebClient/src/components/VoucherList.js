"use client";

import { useEffect, useState } from "react";
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
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  Fade,
  createTheme,
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import {
  Add,
  Edit,
  Search,
  Discount,
  LocalOffer,
  CalendarMonth,
  AttachMoney,
  FilterList,
  Info,
} from "@mui/icons-material";

// Cinema-inspired dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8e24aa", // Purple for vouchers
    },
    secondary: {
      main: "#00bcd4", // Cyan
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

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theaterBrandsLoading, setTheaterBrandsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [theaterBrands, setTheaterBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [isVoucherUsed, setIsVoucherUsed] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    discount: 0,
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    minBillPrice: 0,
    description: "",
    theaterBrandId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTheaterBrands();
    fetchVouchers();
  }, []);

  useEffect(() => {
    filterVouchers();
  }, [vouchers, searchTerm, selectedBrand]);

  const fetchTheaterBrands = () => {
    setTheaterBrandsLoading(true);
    axios
      .get("http://localhost:8080/api/admin/theaterbrands")
      .then((response) => {
        console.log("Theater Brands:", response.data);
        setTheaterBrands(response.data);
        if (response.data.length > 0) {
          setFormData((prev) => ({ ...prev, theaterBrandId: response.data[0].id }));
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu rạp");
      })
      .finally(() => setTheaterBrandsLoading(false));
  };

  const fetchVouchers = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/admin/vouchers")
      .then((response) => {
        console.log("Vouchers:", response.data);
        setVouchers(response.data);
        setFilteredVouchers(response.data);
      })
      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu voucher");
      })
      .finally(() => setLoading(false));
  };

  const fetchVouchersByBrand = (brandId) => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/admin/vouchers/by-brand/${brandId}`)
      .then((response) => {
        console.log("Vouchers by brand:", response.data);
        setVouchers(response.data);
        setFilteredVouchers(response.data);
      })
      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu voucher theo rạp");
      })
      .finally(() => setLoading(false));
  };

  const checkVoucherUsage = (voucherId) => {
    return axios
      .get(`http://localhost:8080/api/admin/vouchers/${voucherId}/is-used`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        toast.error("Lỗi khi kiểm tra trạng thái sử dụng voucher");
        return false;
      });
  };

  const filterVouchers = () => {
    let filtered = [...vouchers];

    if (searchTerm) {
      filtered = filtered.filter((voucher) =>
        voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVouchers(filtered);
  };

  const handleBrandChange = (event) => {
    const brandId = event.target.value;
    setSelectedBrand(brandId);

    if (brandId === "all") {
      fetchVouchers();
    } else {
      fetchVouchersByBrand(brandId);
    }
  };

  const handleAddVoucher = () => {
    axios
      .post("http://localhost:8080/api/admin/vouchers", {
        ...formData,
        theaterBrandId: formData.theaterBrandId,
      })
      .then((response) => {
        setVouchers([...vouchers, response.data.data]);
        toast.success("Thêm voucher thành công");
        setAddDialogOpen(false);
        resetFormData();
      })
      .catch((error) => {
        toast.error("Lỗi khi thêm voucher: " + (error.response?.data?.message || error.message));
      });
  };

  const handleEditVoucher = () => {
    if (!currentVoucher) return;

    axios
      .put(`http://localhost:8080/api/admin/vouchers/${currentVoucher.id}`, {
        ...formData,
        theaterBrandId: formData.theaterBrandId,
      })
      .then((response) => {
        const updatedVouchers = vouchers.map((v) =>
          v.id === currentVoucher.id ? response.data : v
        );
        setVouchers(updatedVouchers);
        toast.success("Cập nhật voucher thành công");
        setEditDialogOpen(false);
      })
      .catch((error) => {
        toast.error("Lỗi khi cập nhật voucher: " + (error.response?.data?.message || error.message));
      });
  };

  const handleToggleActive = async (voucher) => {
    const updatedVoucher = {
      ...voucher,
      isActive: !voucher.isActive,
    };

    axios
      .put(`http://localhost:8080/api/admin/vouchers/${voucher.id}`, {
        isActive: !voucher.isActive,
      })
      .then((response) => {
        const updatedVouchers = vouchers.map((v) =>
          v.id === voucher.id ? { ...v, isActive: !v.isActive } : v
        );
        setVouchers(updatedVouchers);
        toast.success(`Voucher đã được ${!voucher.isActive ? "kích hoạt" : "vô hiệu hóa"}`);
      })
      .catch((error) => {
        toast.error("Lỗi khi cập nhật trạng thái voucher");
      });
  };

  const openEditDialog = async (voucher) => {
    setCurrentVoucher(voucher);

    const isUsed = await checkVoucherUsage(voucher.id);
    setIsVoucherUsed(isUsed);

    setFormData({
      discount: voucher.discount,
      validFrom: new Date(voucher.validFrom),
      validUntil: new Date(voucher.validUntil),
      minBillPrice: voucher.minBillPrice,
      description: voucher.description,
      theaterBrandId: voucher.theaterBrandId,
      isActive: voucher.isActive,
    });

    setEditDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      discount: 0,
      validFrom: new Date(),
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      minBillPrice: 0,
      description: "",
      theaterBrandId: theaterBrands.length > 0 ? theaterBrands[0].id : "",
      isActive: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  // Stats calculation
  const activeVouchers = vouchers.filter((v) => v.isActive).length;
  const expiredVouchers = vouchers.filter((v) => new Date(v.validUntil) < new Date()).length;

  const getGradientColor = (discount) => {
    if (discount >= 50) {
      return "linear-gradient(135deg, #D500F9, #651FFF)";
    } else if (discount >= 30) {
      return "linear-gradient(135deg, #00E676, #00B0FF)";
    } else {
      return "linear-gradient(135deg, #FF9100, #FF5252)";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  // Check if voucher is currently active based on validFrom and validUntil
  const isActiveNow = (validFrom, validUntil) => {
    const now = new Date("2025-05-23T12:11:00+07:00");
    return (
      new Date(validFrom) <= now &&
      now <= new Date(validUntil)
    );
  };

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
              background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
              transform: "translate(30%, -60%)",
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="white"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                }}
              >
                <LocalOffer sx={{ mr: 1.5, fontSize: 35 }} />
                Quản Lý Voucher
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 0.5, color: "rgba(255,255,255,0.85)" }}>
                Quản lý tất cả voucher khuyến mãi trong hệ thống
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                resetFormData();
                setAddDialogOpen(true);
              }}
              sx={{
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.25)",
                color: "white",
                px: 3,
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.4)",
                },
              }}
              disabled={theaterBrands.length === 0}
            >
              Thêm Voucher Mới
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
                "&:hover": {
                  transform: "translateY(-5px)",
                  transition: "transform 0.3s ease",
                },
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
                    <LocalOffer sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {vouchers.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Tổng Voucher
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
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
              <Box sx={{ height: 5, bgcolor: "#00bcd4" }} />
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "rgba(0, 188, 212, 0.9)",
                      width: 60,
                      height: 60,
                      boxShadow: "0 4px 14px rgba(0, 188, 212, 0.4)",
                    }}
                  >
                    <Discount sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {activeVouchers}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Voucher Đang Hoạt Động
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
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
              <Box sx={{ height: 5, bgcolor: "#ff5252" }} />
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
                    <CalendarMonth sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {expiredVouchers}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Voucher Hết Hạn
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
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
                placeholder="Tìm kiếm voucher ..."
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "1.1rem" },
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
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
              <FilterList sx={{ mx: 1.5, color: "#00bcd4" }} />
              <FormControl fullWidth variant="standard">
                <Select
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  displayEmpty
                  disableUnderline
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="all">Tất cả rạp</MenuItem>
                  {theaterBrands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.theaterBrandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>

        {loading || theaterBrandsLoading ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress size={60} thickness={5} sx={{ color: "#8e24aa" }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : filteredVouchers.length === 0 ? (
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
              <LocalOffer sx={{ fontSize: 80, color: "#666", mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Không tìm thấy voucher
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vui lòng điều chỉnh tìm kiếm hoặc thêm voucher mới
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
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", py: 2 }}>Mã Giảm Giá</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Rạp Áp Dụng</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Thời Gian</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Giá Trị Tối Thiểu</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Trạng Thái</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Thao Tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVouchers.map((voucher) => {
                    const theaterBrand = theaterBrands.find((brand) => brand.id === voucher.theaterBrandId);
                    const theaterBrandName = theaterBrand ? theaterBrand.theaterBrandName : "Không xác định";

                    return (
                      <TableRow
                        key={voucher.id}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(142, 36, 170, 0.08)",
                            "& .MuiIconButton-root": { opacity: 1 },
                          },
                          transition: "background-color 0.2s ease",
                          opacity: !voucher.isActive || isExpired(voucher.validUntil) ? 0.7 : 1,
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                background: getGradientColor(voucher.discount),
                                width: 45,
                                height: 45,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                              }}
                            >
                              {voucher.discount}k
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">Giảm {voucher.discount}k</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {voucher.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={theaterBrandName}
                            size="small"
                            sx={{
                              fontWeight: "medium",
                              bgcolor: "rgba(0, 188, 212, 0.15)",
                              color: "#00bcd4",
                              borderRadius: "12px",
                              py: 0.5,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">Từ: {formatDate(voucher.validFrom)}</Typography>
                            <Typography variant="body2">Đến: {formatDate(voucher.validUntil)}</Typography>
                            {isActiveNow(voucher.validFrom, voucher.validUntil) && (
                              <Chip
                                label="Đang áp dụng"
                                size="small"
                                sx={{
                                  bgcolor: "rgba(0, 128, 0, 0.15)",
                                  color: "#00FF00",
                                  fontSize: "0.7rem",
                                  height: 20,
                                  mt: 0.5,
                                }}
                              />
                            )}
                            {isExpired(voucher.validUntil) && (
                              <Chip
                                label="Đã hết hạn"
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255, 82, 82, 0.15)",
                                  color: "#ff5252",
                                  fontSize: "0.7rem",
                                  height: 20,
                                  mt: 0.5,
                                }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <AttachMoney style={{ width: 20, height: 20, color: "#00bcd4" }} />
                            <Typography>{voucher.minBillPrice.toLocaleString("vi-VN")} kVNĐ</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={voucher.isActive}
                                onChange={() => handleToggleActive(voucher)}
                                color="primary"
                              />
                            }
                            label={voucher.isActive ? "Đang hoạt động" : "Đã tắt"}
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Chỉnh sửa voucher">
                            <IconButton
                              onClick={() => openEditDialog(voucher)}
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
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        )}

        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: "#1e1e1e",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Thêm Voucher Mới
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số tiền giảm giá"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">k</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Giá trị hóa đơn tối thiểu"
                  name="minBillPrice"
                  type="number"
                  value={formData.minBillPrice}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kVNĐ</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Rạp áp dụng</InputLabel>
                  <Select
                    name="theaterBrandId"
                    value={formData.theaterBrandId}
                    onChange={handleInputChange}
                    label="Rạp áp dụng"
                  >
                    {theaterBrands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.theaterBrandName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Kích hoạt voucher"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={formData.validFrom}
                    onChange={(date) => handleDateChange("validFrom", date)}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                    sx={{ width: "100%", mb: 2 }}
                  />
                  <DatePicker
                    label="Ngày kết thúc"
                    value={formData.validUntil}
                    onChange={(date) => handleDateChange("validUntil", date)}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Hủy
            </Button>
            <Button onClick={handleAddVoucher} color="primary" variant="contained" sx={{ borderRadius: 2 }}>
              Thêm Voucher
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: "#1e1e1e",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Chỉnh Sửa Voucher
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                {isVoucherUsed && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, bgcolor: "rgba(255, 82, 82, 0.15)", p: 1, borderRadius: 1 }}>
                    <Info sx={{ color: "#ff5252", mr: 1 }} />
                    <Typography variant="body2" color="#ff5252">
                      Voucher này đã có người sử dụng, chỉ có thể chỉnh sửa trạng thái
                    </Typography>
                  </Box>
                )}
                <TextField
                  fullWidth
                  label="Số tiền giảm giá"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">k</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                  disabled={isVoucherUsed}
                />
                <TextField
                  fullWidth
                  label="Giá trị hóa đơn tối thiểu"
                  name="minBillPrice"
                  type="number"
                  value={formData.minBillPrice}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kVNĐ</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                  disabled={isVoucherUsed}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Rạp áp dụng</InputLabel>
                  <Select
                    name="theaterBrandId"
                    value={formData.theaterBrandId}
                    onChange={handleInputChange}
                    label="Rạp áp dụng"
                    disabled={isVoucherUsed}
                  >
                    {theaterBrands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.theaterBrandName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Kích hoạt voucher"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={formData.validFrom}
                    onChange={(date) => handleDateChange("validFrom", date)}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                    sx={{ width: "100%", mb: 2 }}
                    disabled={isVoucherUsed}
                  />
                  <DatePicker
                    label="Ngày kết thúc"
                    value={formData.validUntil}
                    onChange={(date) => handleDateChange("validUntil", date)}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                    sx={{ width: "100%", mb: 2 }}
                    disabled={isVoucherUsed}
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  disabled={isVoucherUsed}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Hủy
            </Button>
            <Button onClick={handleEditVoucher} color="primary" variant="contained" sx={{ borderRadius: 2 }}>
              Lưu Thay Đổi
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default VoucherManagement;