"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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
  Radio,
  RadioGroup,
  FormControlLabel as RadioFormControlLabel,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { toast } from "react-toastify"
import { Add, Edit, Search, LocalOffer, CalendarMonth, AttachMoney, FilterList, Info } from "@mui/icons-material"

// Cinema-inspired dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8e24aa",
    },
    secondary: {
      main: "#00bcd4",
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
})

// Ánh xạ ngày trong tuần giữa backend (tiếng Anh) và UI (tiếng Việt)
const dayMapping = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
  Sunday: "Chủ Nhật",
}

// Hàm chuyển đổi từ backend (tiếng Anh) sang UI (tiếng Việt)
const toVietnameseDay = (day) => dayMapping[day] || day

// Hàm chuyển đổi từ UI (tiếng Việt) sang backend (tiếng Anh)
const toEnglishDay = (day) => {
  return Object.keys(dayMapping).find((key) => dayMapping[key] === day) || day
}

const PriceAdjustmentManagement = () => {
  const [adjustments, setAdjustments] = useState([])
  const [filteredAdjustments, setFilteredAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [seatTypesLoading, setSeatTypesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [seatTypes, setSeatTypes] = useState([])
  const [selectedSeatType, setSelectedSeatType] = useState("all")
  const [selectedTimeType, setSelectedTimeType] = useState("all")

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentAdjustment, setCurrentAdjustment] = useState(null)
  const [isAdjustmentActive, setIsAdjustmentActive] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    seatTypeId: "",
    description: "",
    dayOfWeek: "",
    specificDate: null,
    priceIncrease: 0,
    isActive: true,
    timeType: "dayOfWeek",
  })

  useEffect(() => {
    fetchSeatTypes()
    fetchAdjustments()
  }, [])

  useEffect(() => {
    filterAdjustments()
  }, [adjustments, searchTerm, selectedSeatType, selectedTimeType])

  const fetchSeatTypes = () => {
    setSeatTypesLoading(true)
    axios
      .get("http://localhost:8080/api/admin/seat-types")
      .then((response) => {
        console.log("Seat Types:", response.data)
        setSeatTypes(response.data)
        if (response.data.length > 0) {
          setFormData((prev) => ({ ...prev, seatTypeId: response.data[0].id }))
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu loại ghế")
      })
      .finally(() => setSeatTypesLoading(false))
  }

  const fetchAdjustments = () => {
    setLoading(true)
    axios
      .get("http://localhost:8080/api/admin/price-adjustments")
      .then((response) => {
        console.log("Price Adjustments:", response.data)
        setAdjustments(response.data)
        setFilteredAdjustments(response.data)
      })
      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu điều chỉnh giá")
      })
      .finally(() => setLoading(false))
  }

  const fetchAdjustmentsBySeatType = (seatTypeId) => {
    setLoading(true)
    axios
      .get(`http://localhost:8080/api/admin/price-adjustments/by-seat-type/${seatTypeId}`)
      .then((response) => {
        console.log("Adjustments by seat type:", response.data)
        setAdjustments(response.data)
        setFilteredAdjustments(response.data)
      })
      .catch((error) => {
        toast.error("Lỗi khi tải dữ liệu điều chỉnh giá theo loại ghế")
      })
      .finally(() => setLoading(false))
  }

  const checkAdjustmentActive = (adjustmentId) => {
    return axios
      .get(`http://localhost:8080/api/admin/price-adjustments/${adjustmentId}/is-active`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        toast.error("Lỗi khi kiểm tra trạng thái hoạt động")
        return false
      })
  }

  const filterAdjustments = () => {
    let filtered = [...adjustments]

    if (searchTerm) {
      filtered = filtered.filter((adjustment) =>
        adjustment.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedTimeType !== "all") {
      filtered = filtered.filter((adjustment) =>
        selectedTimeType === "dayOfWeek" ? adjustment.dayOfWeek : adjustment.specificDate,
      )
    }

    setFilteredAdjustments(filtered)
  }

  const handleSeatTypeChange = (event) => {
    const seatTypeId = event.target.value
    setSelectedSeatType(seatTypeId)

    if (seatTypeId === "all") {
      fetchAdjustments()
    } else {
      fetchAdjustmentsBySeatType(seatTypeId)
    }
  }

  const handleTimeTypeFilterChange = (event) => {
    setSelectedTimeType(event.target.value)
  }

  const handleAddAdjustment = () => {
    const payload = {
      seatTypeId: formData.seatTypeId,
      description: formData.description,
      priceIncrease: Number(formData.priceIncrease),
      isActive: formData.isActive,
      ...(formData.timeType === "dayOfWeek" && {
        dayOfWeek: formData.dayOfWeek ? toEnglishDay(formData.dayOfWeek) : "",
      }),
      ...(formData.timeType === "specificDate" && {
        specificDate: formData.specificDate
          ? `${formData.specificDate.getFullYear()}-${String(formData.specificDate.getMonth() + 1).padStart(2, "0")}-${String(formData.specificDate.getDate()).padStart(2, "0")}`
          : null,
      }),
    }

    axios
      .post("http://localhost:8080/api/admin/price-adjustments", payload)
      .then((response) => {
        setAdjustments([...adjustments, response.data.data])
        toast.success("Thêm điều chỉnh giá thành công")
        setAddDialogOpen(false)
        resetFormData()
      })
      .catch((error) => {
        toast.error("Lỗi khi thêm điều chỉnh giá: " + (error.response?.data?.message || error.message))
      })
  }

  const handleEditAdjustment = () => {
    if (!currentAdjustment) return

    const payload = {
      seatTypeId: formData.seatTypeId,
      description: formData.description,
      priceIncrease: Number(formData.priceIncrease),
      isActive: formData.isActive,
      ...(formData.timeType === "dayOfWeek" && {
        dayOfWeek: formData.dayOfWeek ? toEnglishDay(formData.dayOfWeek) : "",
      }),
      ...(formData.timeType === "specificDate" && {
        specificDate: formData.specificDate
          ? `${formData.specificDate.getFullYear()}-${String(formData.specificDate.getMonth() + 1).padStart(2, "0")}-${String(formData.specificDate.getDate()).padStart(2, "0")}`
          : null,
      }),
    }

    axios
      .put(`http://localhost:8080/api/admin/price-adjustments/${currentAdjustment.adjustmentId}`, payload)
      .then((response) => {
        const updatedAdjustments = adjustments.map((a) =>
          a.adjustmentId === currentAdjustment.adjustmentId ? response.data : a,
        )
        setAdjustments(updatedAdjustments)
        toast.success("Cập nhật điều chỉnh giá thành công")
        setEditDialogOpen(false)
      })
      .catch((error) => {
        toast.error("Lỗi khi cập nhật điều chỉnh giá: " + (error.response?.data?.message || error.message))
      })
  }

  const handleToggleActive = async (adjustment) => {
    const updatedAdjustment = {
      seatTypeId: adjustment.seatTypeId,
      description: adjustment.description,
      priceIncrease: adjustment.priceIncrease,
      isActive: !adjustment.isActive,
      ...(adjustment.dayOfWeek && { dayOfWeek: adjustment.dayOfWeek }),
      ...(adjustment.specificDate && { specificDate: adjustment.specificDate }),
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/price-adjustments/${adjustment.adjustmentId}`,
        updatedAdjustment,
      )
      const updatedAdjustments = adjustments.map((a) =>
        a.adjustmentId === adjustment.adjustmentId ? response.data : a,
      )
      setAdjustments(updatedAdjustments)
      filterAdjustments() // Cập nhật filteredAdjustments
      toast.success(`Điều chỉnh giá đã được ${!adjustment.isActive ? "kích hoạt" : "vô hiệu hóa"}`)
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error.response?.data || error.message)
      toast.error("Lỗi khi cập nhật trạng thái điều chỉnh giá: " + (error.response?.data?.message || error.message))
    }
  }

  const openEditDialog = async (adjustment) => {
    setCurrentAdjustment(adjustment)

    const isActive = await checkAdjustmentActive(adjustment.adjustmentId)
    setIsAdjustmentActive(isActive)

    setFormData({
      seatTypeId: adjustment.seatTypeId,
      description: adjustment.description,
      dayOfWeek: adjustment.dayOfWeek ? toVietnameseDay(adjustment.dayOfWeek) : "",
      specificDate: adjustment.specificDate ? new Date(adjustment.specificDate) : null,
      priceIncrease: adjustment.priceIncrease,
      isActive: adjustment.isActive,
      timeType: adjustment.specificDate ? "specificDate" : "dayOfWeek",
    })

    setEditDialogOpen(true)
  }

  const resetFormData = () => {
    setFormData({
      seatTypeId: seatTypes.length > 0 ? seatTypes[0].id : "",
      description: "",
      dayOfWeek: "",
      specificDate: null,
      priceIncrease: 0,
      isActive: true,
      timeType: "dayOfWeek",
    })
  }

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    })
  }

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
      dayOfWeek: "",
    })
  }

  const handleTimeTypeChange = (event) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      timeType: value,
      ...(value === "dayOfWeek" ? { specificDate: null } : { dayOfWeek: "" }),
    }))
  }

  const isExpired = (specificDate) => {
    return specificDate && new Date(specificDate) < new Date("2025-05-23T11:52:00+07:00")
  }

  const isActiveToday = (specificDate, dayOfWeek) => {
    const now = new Date("2025-05-23T11:52:00+07:00")
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = dayNames[now.getDay()]

    if (specificDate) {
      const adjustmentDate = new Date(specificDate)
      return adjustmentDate.toDateString() === now.toDateString()
    } else if (dayOfWeek) {
      return dayOfWeek === today
    }
    return false
  }

  const activeAdjustments = adjustments.filter((a) => a.isActive).length
  const expiredAdjustments = adjustments.filter((a) => a.specificDate && isExpired(a.specificDate)).length

  const getGradientColor = (priceIncrease) => {
    if (Math.abs(priceIncrease) >= 50000) {
      return "linear-gradient(135deg, #D500F9, #651FFF)"
    } else if (Math.abs(priceIncrease) >= 20000) {
      return "linear-gradient(135deg, #00E676, #00B0FF)"
    } else {
      return "linear-gradient(135deg, #FF9100, #FF5252)"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // Format price for display in avatar (show as "k" format)
  const formatPriceForAvatar = (priceIncrease) => {
    const absValue = Math.abs(priceIncrease)
    if (absValue >= 1000) {
      const sign = priceIncrease < 0 ? "-" : "+"
      return `${sign}${Math.floor(absValue / 1000)}k`
    }
    const sign = priceIncrease < 0 ? "-" : "+"
    return `${sign}${absValue}`
  }

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
                sx={{ display: "flex", alignItems: "center", textShadow: "0 2px 10px rgba(0,0,0,0.25)" }}
              >
                <LocalOffer sx={{ mr: 1.5, fontSize: 35 }} />
                Quản Lý Điều Chỉnh Giá
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 0.5, color: "rgba(255,255,255,0.85)" }}>
                Quản lý tất cả điều chỉnh giá trong hệ thống
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                resetFormData()
                setAddDialogOpen(true)
              }}
              sx={{
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.25)",
                color: "white",
                px: 3,
                "&:hover": { bgcolor: "rgba(0,0,0,0.4)" },
              }}
              disabled={seatTypes.length === 0}
            >
              Thêm Điều Chỉnh Giá Mới
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
                    <LocalOffer sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {adjustments.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Tổng Điều Chỉnh
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
                "&:hover": { transform: "translateY(-5px)", transition: "transform 0.3s ease" },
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
                    <AttachMoney sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {activeAdjustments}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Điều Chỉnh Đang Hoạt Động
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
                "&:hover": { transform: "translateY(-5px)", transition: "transform 0.3s ease" },
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
                      {expiredAdjustments}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Điều Chỉnh Hết Hạn Chỉnh Sửa
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={4}>
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
                placeholder="Tìm kiếm điều chỉnh giá..."
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem" } }}
              />
            </Paper>
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
              <FilterList sx={{ mx: 1.5, color: "#00bcd4" }} />
              <FormControl fullWidth variant="standard">
                <Select
                  value={selectedSeatType}
                  onChange={handleSeatTypeChange}
                  displayEmpty
                  disableUnderline
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="all">Tất cả loại ghế</MenuItem>
                  {seatTypes.map((seatType) => (
                    <MenuItem key={seatType.id} value={seatType.id}>
                      {seatType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
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
              <FilterList sx={{ mx: 1.5, color: "#00bcd4" }} />
              <FormControl fullWidth variant="standard">
                <Select
                  value={selectedTimeType}
                  onChange={handleTimeTypeFilterChange}
                  displayEmpty
                  disableUnderline
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="all">Tất cả thời gian</MenuItem>
                  <MenuItem value="dayOfWeek">Ngày trong tuần</MenuItem>
                  <MenuItem value="specificDate">Ngày cụ thể</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>

        {loading || seatTypesLoading ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress size={60} thickness={5} sx={{ color: "#8e24aa" }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : filteredAdjustments.length === 0 ? (
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
                Không tìm thấy điều chỉnh giá
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vui lòng điều chỉnh tìm kiếm hoặc thêm điều chỉnh mới
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
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", py: 2, width: "15%" }}>
                      Tăng/Giảm Giá
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "15%" }}>Loại Ghế</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "15%" }}>Thời Gian</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "35%" }}>Mô Tả</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", width: "15%" }}>Trạng Thái</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem", width: "10%" }}>
                      Thao Tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdjustments.map((adjustment) => {
                    const seatType = seatTypes.find((st) => st.id === adjustment.seatTypeId)
                    const seatTypeName = seatType ? seatType.name : "Không xác định"
                    const isActive = isActiveToday(adjustment.specificDate, adjustment.dayOfWeek)
                    const isExpiredStatus = adjustment.specificDate && isExpired(adjustment.specificDate)
                    const displayAmount = Math.abs(adjustment.priceIncrease)
                    const isDecrease = adjustment.priceIncrease < 0

                    return (
                      <TableRow
                        key={adjustment.adjustmentId}
                        sx={{
                          "&:hover": { bgcolor: "rgba(142, 36, 170, 0.08)", "& .MuiIconButton-root": { opacity: 1 } },
                          transition: "background-color 0.2s ease",
                          opacity: !adjustment.isActive || (isExpiredStatus && !isActive) ? 0.7 : 1,
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                background: getGradientColor(adjustment.priceIncrease),
                                width: 45,
                                height: 45,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                              }}
                            >
                              {formatPriceForAvatar(adjustment.priceIncrease)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">
                                {isDecrease ? "Giảm" : "Tăng"} {displayAmount.toLocaleString("vi-VN")} vnđ
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={seatTypeName}
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
                            {adjustment.specificDate && (
                              <Typography variant="body2">Ngày: {formatDate(adjustment.specificDate)}</Typography>
                            )}
                            {adjustment.dayOfWeek && (
                              <Typography variant="body2">Ngày: {toVietnameseDay(adjustment.dayOfWeek)}</Typography>
                            )}
                            {isActive && (
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
                            {!isActive && isExpiredStatus && (
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
                          <Typography variant="body2">{adjustment.description || "Không có mô tả"}</Typography>
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={adjustment.isActive}
                                onChange={() => handleToggleActive(adjustment)}
                                color="primary"
                              />
                            }
                            label={adjustment.isActive ? "Đang hoạt động" : "Đã tắt"}
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Chỉnh sửa điều chỉnh giá">
                            <IconButton
                              onClick={() => openEditDialog(adjustment)}
                              sx={{
                                color: "#00bcd4",
                                bgcolor: "rgba(0, 188, 212, 0.1)",
                                opacity: 0.8,
                                "&:hover": { bgcolor: "rgba(0, 188, 212, 0.2)", transform: "scale(1.05)" },
                              }}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
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
          PaperProps={{ sx: { borderRadius: 3, bgcolor: "#1e1e1e", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)" } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Thêm Điều Chỉnh Giá Mới
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tăng/Giảm giá"
                  name="priceIncrease"
                  type="number"
                  value={formData.priceIncrease}
                  onChange={handleInputChange}
                  InputProps={{ endAdornment: <InputAdornment position="end">vnđ</InputAdornment> }}
                  sx={{ mb: 3 }}
                />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Loại ghế</InputLabel>
                  <Select name="seatTypeId" value={formData.seatTypeId} onChange={handleInputChange} label="Loại ghế">
                    {seatTypes.map((seatType) => (
                      <MenuItem key={seatType.id} value={seatType.id}>
                        {seatType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Chọn loại thời gian
                  </Typography>
                  <RadioGroup row name="timeType" value={formData.timeType} onChange={handleTimeTypeChange}>
                    <RadioFormControlLabel value="dayOfWeek" control={<Radio />} label="Ngày trong tuần" />
                    <RadioFormControlLabel value="specificDate" control={<Radio />} label="Ngày cụ thể" />
                  </RadioGroup>
                </FormControl>
                {formData.timeType === "dayOfWeek" && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Ngày trong tuần</InputLabel>
                    <Select
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleInputChange}
                      label="Ngày trong tuần"
                    >
                      <MenuItem value="">Không chọn</MenuItem>
                      {Object.keys(dayMapping).map((day) => (
                        <MenuItem key={day} value={toVietnameseDay(day)}>
                          {toVietnameseDay(day)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {formData.timeType === "specificDate" && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày cụ thể"
                      value={formData.specificDate}
                      onChange={(date) => handleDateChange("specificDate", date)}
                      renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
                      sx={{ width: "100%", mb: 3 }}
                    />
                  </LocalizationProvider>
                )}
                <FormControlLabel
                  control={
                    <Switch checked={formData.isActive} onChange={handleInputChange} name="isActive" color="primary" />
                  }
                  label="Kích hoạt điều chỉnh"
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  sx={{ mb: 3, width: "320%" }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Hủy
            </Button>
            <Button onClick={handleAddAdjustment} color="primary" variant="contained" sx={{ borderRadius: 2 }}>
              Thêm Điều Chỉnh
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, bgcolor: "#1e1e1e", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)" } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Chỉnh Sửa Điều Chỉnh Giá
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                {isAdjustmentActive && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      bgcolor: "rgba(255, 82, 82, 0.15)",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Info sx={{ color: "#ff5252", mr: 1 }} />
                    <Typography variant="body2" color="#ff5252">
                      Điều chỉnh giá này đã đến hoặc quá ngày áp dụng, chỉ có thể chỉnh sửa trạng thái
                    </Typography>
                  </Box>
                )}
                <TextField
                  fullWidth
                  label="Tăng/Giảm giá"
                  name="priceIncrease"
                  type="number"
                  value={formData.priceIncrease}
                  onChange={handleInputChange}
                  InputProps={{ endAdornment: <InputAdornment position="end">vnđ</InputAdornment> }}
                  sx={{ mb: 3 }}
                  disabled={isAdjustmentActive}
                />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Loại ghế</InputLabel>
                  <Select
                    name="seatTypeId"
                    value={formData.seatTypeId}
                    onChange={handleInputChange}
                    label="Loại ghế"
                    disabled={isAdjustmentActive}
                  >
                    {seatTypes.map((seatType) => (
                      <MenuItem key={seatType.id} value={seatType.id}>
                        {seatType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Chọn loại thời gian
                  </Typography>
                  <RadioGroup
                    row
                    name="timeType"
                    value={formData.timeType}
                    onChange={handleTimeTypeChange}
                    disabled={true}
                  >
                    <RadioFormControlLabel
                      value="dayOfWeek"
                      control={<Radio disabled={true} />}
                      label="Ngày trong tuần"
                    />
                    <RadioFormControlLabel
                      value="specificDate"
                      control={<Radio disabled={true} />}
                      label="Ngày cụ thể"
                    />
                  </RadioGroup>
                </FormControl>
                {formData.timeType === "dayOfWeek" && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Ngày trong tuần</InputLabel>
                    <Select
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleInputChange}
                      label="Ngày trong tuần"
                      disabled={isAdjustmentActive}
                    >
                      <MenuItem value="">Không chọn</MenuItem>
                      {Object.keys(dayMapping).map((day) => (
                        <MenuItem key={day} value={toVietnameseDay(day)}>
                          {toVietnameseDay(day)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {formData.timeType === "specificDate" && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày cụ thể"
                      value={formData.specificDate}
                      onChange={(date) => handleDateChange("specificDate", date)}
                      renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
                      sx={{ width: "100%", mb: 3 }}
                      disabled={isAdjustmentActive}
                    />
                  </LocalizationProvider>
                )}
                <FormControlLabel
                  control={
                    <Switch checked={formData.isActive} onChange={handleInputChange} name="isActive" color="primary" />
                  }
                  label="Kích hoạt điều chỉnh"
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  sx={{ mb: 3, width: "320%" }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Hủy
            </Button>
            <Button onClick={handleEditAdjustment} color="primary" variant="contained" sx={{ borderRadius: 2 }}>
              Lưu Thay Đổi
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}

export default PriceAdjustmentManagement
