import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, Star, Heart } from "lucide-react";

const initialFoodItems = [
  {
    id: 1,
    foodName: "Bỏng Ngô Caramel Cao Cấp",
    description: "Ngọt ngào với lớp caramel thơm lừng, giòn tan tuyệt hảo",
    theaterBrand: "CGV",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    rating: 4.8,
    category: "Đồ ăn vặt",
    isPopular: true,
  },
  {
    id: 2,
    foodName: "Hotdog Đặc Biệt",
    description: "Xúc xích cao cấp kèm sốt đặc biệt và rau củ tươi ngon",
    theaterBrand: "Lotte Cinema",
    price: 55000,
    image: null,
    rating: 4.6,
    category: "Món chính",
    isPopular: false,
  },
  {
    id: 3,
    foodName: "Coca-Cola Lạnh",
    description: "Nước ngọt có ga mát lạnh, sảng khoái tuyệt đối",
    theaterBrand: "Galaxy Cinema",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop",
    rating: 4.9,
    category: "Nước uống",
    isPopular: true,
  },
  {
    id: 4,
    foodName: "Nachos Đặc Biệt",
    description: "Bánh tortilla giòn với phô mai tan chảy và jalapeño cay nồng",
    theaterBrand: "CGV",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop",
    rating: 4.7,
    category: "Đồ ăn vặt",
    isPopular: true,
  },
];

const ModernFoodAdmin = () => {
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xoá món ăn này?");
    if (confirmed) {
      setFoodItems(foodItems.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    alert(`Sửa món: ${item.foodName}`);
  };

  const categories = ["Tất cả", "Đồ ăn vặt", "Món chính", "Nước uống"];

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch = item.foodName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      textAlign: "center",
      padding: "2rem 0",
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease",
    },
    title: {
      fontSize: "3rem",
      fontWeight: "bold",
      margin: "0 0 1rem 0",
      background: "linear-gradient(45deg, #FFD700, #FFA500, #FF69B4)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#f0f0f0",
      margin: 0,
    },
    controlsSection: {
      padding: "0 2rem 2rem",
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease 0.2s",
    },
    searchContainer: {
      position: "relative",
      maxWidth: "500px",
      margin: "0 auto 2rem",
    },
    searchInput: {
      width: "100%",
      padding: "1rem 1rem 1rem 3rem",
      fontSize: "1rem",
      border: "none",
      borderRadius: "25px",
      background: "rgba(255, 255, 255, 0.2)",
      color: "white",
      outline: "none",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    },
    searchIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#ccc",
    },
    categoriesContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      flexWrap: "wrap",
      marginBottom: "2rem",
    },
    categoryButton: {
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: "500",
    },
    categoryButtonActive: {
      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
      color: "white",
      transform: "scale(1.05)",
    },
    categoryButtonInactive: {
      background: "rgba(255, 255, 255, 0.2)",
      color: "white",
      backdropFilter: "blur(10px)",
    },
    addButton: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(45deg, #4CAF50, #45a049)",
      color: "white",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      transition: "all 0.3s ease",
      margin: "0 auto",
      display: "block",
    },
    gridContainer: {
      padding: "0 2rem",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    card: {
      background: "rgba(255, 255, 255, 0.15)",
      borderRadius: "20px",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transition: "all 0.3s ease",
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? "translateY(0)" : "translateY(30px)",
    },
    cardImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    cardContent: {
      padding: "1.5rem",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      margin: "0 0 0.5rem 0",
      color: "white",
    },
    cardDescription: {
      fontSize: "0.9rem",
      color: "#e0e0e0",
      margin: "0 0 1rem 0",
      lineHeight: "1.4",
    },
    cardBrand: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      background: "rgba(138, 43, 226, 0.3)",
      borderRadius: "15px",
      fontSize: "0.8rem",
      color: "#dda0dd",
      marginBottom: "1rem",
    },
    cardPrice: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#FFD700",
      marginBottom: "1rem",
    },
    cardActions: {
      display: "flex",
      gap: "0.5rem",
    },
    editButton: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem",
      background: "linear-gradient(45deg, #2196F3, #21CBF3)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "0.9rem",
      transition: "all 0.3s ease",
    },
    deleteButton: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem",
      background: "linear-gradient(45deg, #f44336, #e91e63)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "0.9rem",
      transition: "all 0.3s ease",
    },
    popularBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "linear-gradient(45deg, #FFD700, #FFA500)",
      color: "#333",
      padding: "0.25rem 0.75rem",
      borderRadius: "15px",
      fontSize: "0.75rem",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },
    rating: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      fontSize: "0.9rem",
      color: "#FFD700",
      marginBottom: "0.5rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem 2rem",
      color: "#ccc",
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "2rem",
      padding: "4rem 2rem 2rem",
      maxWidth: "800px",
      margin: "0 auto",
    },
    statCard: {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "15px",
      padding: "2rem",
      textAlign: "center",
      backdropFilter: "blur(10px)",
    },
    statNumber: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Quản Lý Thực Đơn Rạp Phim</h1>
        <p style={styles.subtitle}>Hệ thống quản lý hiện đại và trực quan</p>
      </div>

      {/* Controls */}
      <div style={styles.controlsSection}>
        {/* Search */}
        <div style={styles.searchContainer}>
          <Search style={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Categories */}
        <div style={styles.categoriesContainer}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category
                  ? styles.categoryButtonActive
                  : styles.categoryButtonInactive),
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Add Button */}
        <button
          style={styles.addButton}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          <Plus size={20} />
          Thêm Món Mới
        </button>
      </div>

      {/* Food Grid */}
      <div style={styles.gridContainer}>
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              ...styles.card,
              transitionDelay: `${index * 0.1}s`,
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* <img
              src={item.image || "https://th.bing.com/th/id/OIP.buthpwneva6luHGpbt-6tQHaHa?w=165&h=180&c=7&r=0&o=5&cb=iwc2&pid=1.7"}
              alt={item.foodName}
              style={styles.cardImage}
            /> */}
            <img
              src={
                item.image ||
                "https://th.bing.com/th/id/OIP.buthpwneva6luHGpbt-6tQHaHa?w=165&h=180&c=7&r=0&o=5&cb=iwc2&pid=1.7"
              }
              alt={item.foodName}
              style={styles.cardImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://th.bing.com/th/id/OIP.buthpwneva6luHGpbt-6tQHaHa?w=165&h=180&c=7&r=0&o=5&cb=iwc2&pid=1.7";
              }}
            />

            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{item.foodName}</h3>

              <p style={styles.cardDescription}>{item.description}</p>

              <div style={styles.cardBrand}>{item.theaterBrand}</div>

              <div style={styles.cardPrice}>
                {item.price.toLocaleString()} VND
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => handleEdit(item)}
                  style={styles.editButton}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.backgroundColor = "#2980b9";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "#3498db";
                  }}
                  // disabled={isDeleting}
                >
                  <Edit size={16} />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.backgroundColor = "#c0392b";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "#e74c3c";
                  }}
                  // disabled={isDeleting}
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div style={styles.emptyState}>
          <Search
            size={64}
            style={{ margin: "0 auto 1rem", display: "block" }}
          />
          <h3>Không tìm thấy món ăn</h3>
          <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
        </div>
      )}
    </div>
  );
};

export default ModernFoodAdmin;
