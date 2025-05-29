import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { da } from "date-fns/locale";
import { Delete } from "@mui/icons-material";

const FoodForm = (id) => {
  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    theaterBrand: "",
    price: "",
    image: null,
  });

  const [selectedTheaterBrand, setSelectedTheaterBrand] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [theaterBrands, setTheaterBrands] = useState([]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    id = 1;
    axios
      .get("http://localhost:8080/api/admin/theaterbrands")
      .then((response) => {
        const data = response.data;
        console.log("data: ", data);
        setTheaterBrands(data);
      })
      .catch((error) => {
        console.error("Error fetching theater brands:", error);
        alert("Không thể tải danh sách thương hiệu rạp!");
      });
    if (id) {
      console.log("Fetching food data for ID:", id);
      axios
        .get(`http://localhost:8080/api/admin/foods/${id}`)
        .then((response) => {
          const data = response.data;

          setFormData({
            foodName: data.foodName || "",
            description: data.description || "",
            theaterBrand: data.theaterBrand || null,
            price: data.price?.toString() || "",
            image: null, // Không lấy ảnh từ API, sẽ upload lại
          });
          setImagePreview(data.image || null);
          console.log("formData", formData);
          if (data.theaterBrandId) {
            axios
              .get(
                `http://localhost:8080/api/admin/theaterbrands/${data.theaterBrandId}`
              )
              .then((brandResponse) => {
                console.log("Fetched theater brand:", brandResponse);
                setSelectedTheaterBrand(brandResponse.data.data);
              })
              .catch((brandError) => {
                console.error("Error fetching theater brand:", brandError);
                alert("Không thể tải thông tin thương hiệu rạp!");
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching food data:", error);
          alert("Không thể tải thông tin món ăn!");
        });
    }
  }, [id]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    formData.image = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    setFormData((prev) => ({
      ...prev,
      price: value,
    }));

    if (errors.price) {
      setErrors((prev) => ({
        ...prev,
        price: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Kích thước file không được vượt quá 5MB!",
        }));
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Vui lòng chọn file hình ảnh!",
        }));
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = "Vui lòng nhập tên món ăn!";
    }

    if (!formData.theaterBrand) {
      newErrors.theaterBrand = "Vui lòng chọn thương hiệu rạp!";
    }

    if (!formData.price || parseInt(formData.price) <= 0) {
      newErrors.price = "Vui lòng nhập giá tiền hợp lệ!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting food data:", {
        foodName: formData.foodName,
        description: formData.description,
        theaterBrand: formData.theaterBrand,
        price: formData.price,
        image: formData.image,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn làm mới form? Tất cả dữ liệu sẽ bị xóa."
      )
    ) {
      setFormData({
        foodName: "",
        description: "",
        theaterBrand: "",
        price: "",
        image: null,
      });
      setImagePreview(null);
      setErrors({});
      setShowSuccess(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return parseInt(price).toLocaleString("vi-VN");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        background: "rgba(117, 120, 128, 0.6)",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
        zoom: "0.7",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            marginTop: "150px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(to right, #f97316, #ef4444)",
              color: "white",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                margin: "0 0 8px 0",
              }}
            >
              🍕 Food Management
            </h1>
            <p
              style={{
                fontSize: "20px",
                opacity: "0.9",
                margin: "0",
              }}
            >
              Thêm hoặc chỉnh sửa thông tin món ăn
            </p>
          </div>

          <div style={{ padding: "32px" }}>
            {/* Success Message */}
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

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Food Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Tên món ăn <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên món ăn (VD: Pizza Margherita)"
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: `2px solid ${
                      errors.foodName ? "#ef4444" : "#d1d5db"
                    }`,
                    borderRadius: "12px",
                    fontSize: "18px",
                    backgroundColor: errors.foodName ? "#fef2f2" : "#f9fafb",
                    outline: "none",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!errors.foodName) {
                      e.target.style.backgroundColor = "white";
                      e.target.style.borderColor = "#7c3aed";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.foodName) {
                      e.target.style.backgroundColor = "#f9fafb";
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                />
                {errors.foodName && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    ⚠️ {errors.foodName}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Mô tả món ăn
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết về món ăn"
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "2px solid #d1d5db",
                    borderRadius: "12px",
                    fontSize: "18px",
                    backgroundColor: "#f9fafb",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.borderColor = "#7c3aed";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = "#f9fafb";
                    e.target.style.borderColor = "#d1d5db";
                  }}
                />
              </div>

              {/* Theater Brand */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Thương hiệu rạp <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  name="theaterBrand"
                  value={formData.theaterBrand}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: `2px solid ${
                      errors.theaterBrand ? "#ef4444" : "#d1d5db"
                    }`,
                    borderRadius: "12px",
                    fontSize: "18px",
                    backgroundColor: errors.theaterBrand
                      ? "#fef2f2"
                      : "#f9fafb",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!errors.theaterBrand) {
                      e.target.style.backgroundColor = "white";
                      e.target.style.borderColor = "#7c3aed";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.theaterBrand) {
                      e.target.style.backgroundColor = "#f9fafb";
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                >
                  {theaterBrands.map((brand) => (
                    <option key={brand.id} value={brand.theaterBrandName}>
                      {brand.theaterBrandName}
                    </option>
                  ))}
                </select>
                {errors.theaterBrand && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    ⚠️ {errors.theaterBrand}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Giá tiền <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#7c3aed",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    VND
                  </span>
                  <input
                    type="text"
                    name="price"
                    value={formatPrice(formData.price)}
                    onChange={handlePriceChange}
                    placeholder="0"
                    style={{
                      width: "100%",
                      paddingLeft: "48px",
                      paddingRight: "16px",
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      border: `2px solid ${
                        errors.price ? "#ef4444" : "#d1d5db"
                      }`,
                      borderRadius: "12px",
                      fontSize: "18px",
                      backgroundColor: errors.price ? "#fef2f2" : "#f9fafb",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      if (!errors.price) {
                        e.target.style.backgroundColor = "white";
                        e.target.style.borderColor = "#7c3aed";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.price) {
                        e.target.style.backgroundColor = "#f9fafb";
                        e.target.style.borderColor = "#d1d5db";
                      }
                    }}
                  />
                </div>
                {errors.price && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    ⚠️ {errors.price}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Hình ảnh món ăn
                </label>

                {imagePreview ? (
                  <div
                    style={{
                      position: "relative",
                      textAlign: "center",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "4px dashed #c084fc",
                      backgroundColor: "#faf5ff",
                      transition: "all 0.3s",
                      paddingBottom: "12px",
                    }}
                  >
                    {/* Ảnh xem trước */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "256px",
                        display: "block",
                        margin: "0 auto",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        border: "4px solid white",
                        cursor: "pointer",
                      }}
                    />

                    {/* Nút xóa */}
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        fileInputRef.current.value = ""; // reset input
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        zIndex: 20,
                      }}
                    >
                      🗑
                    </button>

                    {/* Label dưới ảnh */}
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      Nhấn vào ảnh để thay đổi
                    </div>

                    {/* input ẩn */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                        zIndex: 10,
                      }}
                    />
                    <div
                      style={{
                        border: `4px dashed ${
                          errors.image ? "#ef4444" : "#c084fc"
                        }`,
                        borderRadius: "12px",
                        padding: "48px",
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: errors.image ? "#fef2f2" : "#faf5ff",
                        transition: "all 0.3s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: "60px", marginBottom: "16px" }}>
                          📷
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Nhấn để chọn hình ảnh
                        </div>
                        <div style={{ color: "#6b7280" }}>
                          Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errors.image && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      margin: "8px 0 0 0",
                    }}
                  >
                    ⚠️ {errors.image}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  paddingTop: "24px",
                }}
              >
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: "linear-gradient(to right, #7c3aed, #2563eb)",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "12px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background =
                        "linear-gradient(to right, #6d28d9, #1d4ed8)";
                      e.target.style.boxShadow =
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background =
                        "linear-gradient(to right, #7c3aed, #2563eb)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  {isSubmitting ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "2px solid white",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          marginRight: "8px",
                        }}
                      ></div>
                      Đang lưu...
                    </span>
                  ) : (
                    "💾 Lưu thông tin"
                  )}
                </button>

                <button
                  onClick={handleReset}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: "linear-gradient(to right, #6b7280, #4b5563)",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "12px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background =
                        "linear-gradient(to right, #4b5563, #374151)";
                      e.target.style.boxShadow =
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background =
                        "linear-gradient(to right, #6b7280, #4b5563)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  🔄 Làm mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FoodForm;
