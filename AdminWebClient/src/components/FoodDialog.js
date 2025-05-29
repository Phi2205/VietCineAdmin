import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Typography,
  IconButton,
  Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { da, se } from "date-fns/locale";
import { Delete } from "@mui/icons-material";
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
function FoodDialog({ open, onClose, onAdd, onUpdate, edittingFood}) {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [theaterBrandId, setTheaterBrandId] = useState(null);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [foodNameError, setFoodNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [theaterBrandError, setTheaterBrandError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [imageError, setImageError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);


  const handleSelectBrand = (e) => {
    setTheaterBrandId(e.target.value);
  };

  const [selectedTheaterBrand, setSelectedTheaterBrand] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [theaterBrands, setTheaterBrands] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "foodName") {
      setFoodName(value);
    }
    if (name === "description") {
      setDescription(value);
    }
    if (name === "price") {
      setPrice(value);
    }
  };

  useEffect(() => {
    handleReset();
    if (open) {
      axios
        .get("http://localhost:8080/api/admin/theaterbrands")
        .then((response) => {
          const data = response.data;
          setTheaterBrands(data); // Gán trước
        })
        .catch((error) => {
          console.error("Error fetching theater brands:", error);
          alert("Không thể tải danh sách thương hiệu rạp!");
        });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (edittingFood) {
        setFoodName(edittingFood.foodName || "");
        setDescription(edittingFood.description || "");
        setTheaterBrandId(Number(edittingFood.theaterBrand.id));
        setPrice(edittingFood.price || "");
        setImage(edittingFood.image || null);
        setImagePreview(edittingFood.image);
      } else {
        setFoodName("");
        setDescription("");
        setTheaterBrandId(null);
        setPrice("");
        setImage(null);
        setImagePreview(null);
      }
      setErrors(false);
    }
  }, [open, theaterBrands, edittingFood]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    setPrice(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!foodName.trim()) {
      newErrors.foodName = "Vui lòng nhập tên món ăn!";
    }

    if (!theaterBrandId) {
      newErrors.theaterBrand = "Vui lòng chọn thương hiệu rạp!";
    }

    if (!price || parseInt(price) <= 0) {
      newErrors.price = "Vui lòng nhập giá tiền hợp lệ!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (!validateForm()) {
      return;
    }
    setUpdateLoading(true);
    e.preventDefault();
    let hasError = false;

    if (!foodName.trim()) {
      setFoodNameError(true);
      return;
    }
    if (!price || parseInt(price) <= 0) {
      setPriceError(true);
      hasError = true;
    }
    if (!theaterBrandId) {
      setTheaterBrandError(true);
      hasError = true;
    }
    if (!description.trim()) {
      setDescriptionError(true);
      hasError = true;
    }
    if (!image && !edittingFood) {
      setImageError(true);
      hasError = true;
    }
    if (hasError) {
      return;
    }
    console.log("Editting food:", edittingFood);
    const formData = new FormData();
    formData.append("foodName", foodName);
    formData.append("description", description);
    formData.append("theaterBrandId", theaterBrandId);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }

    if (edittingFood) {
      formData.append("id", edittingFood.foodId);
      onUpdate(formData);
      setUpdateLoading(false);
    } else {
      onAdd(formData);
      setUpdateLoading(false);
    }
  };

  const handleReset = () => {
    setFoodName("");
    setDescription("");
    setTheaterBrandId(null);
    setPrice("");
    setImage(null);
    setImagePreview(null);
    setFoodNameError(false);
    setDescriptionError(false);
    setTheaterBrandError(false);
    setPriceError(false);
    setImageError(false);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return parseInt(price).toLocaleString("vi-VN");
  };

  return (
    <>
      {updateLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="300px"
          gap={2}
          sx={{
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#ff5252" }} />
          <Typography variant="h6" sx={{ color: "#ff5252" }}>
            Đang tải dữ liệu...
          </Typography>
        </Box>
      ) : (
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { borderRadius: 3, padding: 0 } }}
        >
          {/* Title */}
          <DialogTitle
            sx={{
              background: "linear-gradient(to right, #f97316, #ef4444)",
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🍕 Food Management
            <IconButton
              aria-label="close"
              onClick={() => {
                handleReset(); // reset dữ liệu form
                onClose(); // đóng dialog
              }}
              sx={{ position: "absolute", right: 16, top: 16, color: "white" }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
              {edittingFood ? "Chỉnh sửa thông tin món ăn" : "Thêm mới món ăn"}
            </Typography>
          </DialogTitle>

          {/* Content */}
          <DialogContent dividers sx={{ mt: 2 }}>
            {showSuccess && (
              <div
                style={{
                  background: "#10b981",
                  color: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "24px", marginRight: "12px" }}>
                  ✅
                </span>
                <span style={{ fontWeight: "600" }}>
                  Đã lưu thông tin món ăn thành công!
                </span>
              </div>
            )}

            {/* Tên món ăn */}
            <TextField
              fullWidth
              label="Tên món ăn *"
              name="foodName"
              value={foodName}
              onChange={handleInputChange}
              error={!!errors.foodName}
              helperText={errors.foodName}
              sx={{ mb: 3 }}
            />

            {/* Mô tả */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Mô tả món ăn"
              name="description"
              value={description}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />

            {/* Thương hiệu rạp */}
            <FormControl fullWidth error={!!errors.theaterBrand} sx={{ mb: 3 }}>
              <InputLabel>Thương hiệu rạp *</InputLabel>
              <Select
                name="theaterBrandName"
                value={theaterBrandId || null}
                onChange={handleSelectBrand}
                label="Thương hiệu rạp *"
                required
              >
                {theaterBrands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.theaterBrandName}
                  </MenuItem>
                ))}
              </Select>
              {errors.theaterBrand && (
                <FormHelperText>{errors.theaterBrand}</FormHelperText>
              )}
            </FormControl>
            {/* Giá tiền */}
            <TextField
              fullWidth
              label="Giá tiền *"
              name="price"
              value={price}
              onChange={handlePriceChange}
              error={!!errors.price}
              helperText={errors.price}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: <span style={{ fontWeight: "bold" }}>VND</span>,
              }}
            />

            {/* Ảnh món ăn */}
            <div style={{ marginBottom: "24px" }}>
              <Typography fontWeight={600} mb={1}>
                Hình ảnh món ăn{" "}
                {edittingFood ? "(Cập nhật hình ảnh nếu cần)" : ""}
              </Typography>
              {imagePreview ? (
                <div style={{ position: "relative", textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    style={{
                      maxHeight: 200,
                      borderRadius: 12,
                      cursor: "pointer",
                      boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      handleRemoveImage();
                    }}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "#ef4444",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#dc2626",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current.click()}
                    fullWidth
                  >
                    Chọn hình ảnh
                  </Button>
                </div>
              )}
              {errors.image && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.image}
                </FormHelperText>
              )}
            </div>
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </DialogContent>

          {/* Actions */}
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                background: "linear-gradient(to right, #7c3aed, #2563eb)",
                color: "white",
                px: 4,
                py: 1.5,
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Đang lưu...
                </>
              ) : (
                "💾 Lưu thông tin"
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={isSubmitting}
              sx={{ px: 4, py: 1.5 }}
            >
              🔄 Làm mới
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
export default FoodDialog;
