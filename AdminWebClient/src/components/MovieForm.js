import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField, Button, Box, Typography, Chip, Autocomplete, Paper, 
    Grid, Card, CardContent, FormControlLabel, Switch, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { Movie, ArrowBack, Save, Add } from '@mui/icons-material';

// Dark theme configuration
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#bb86fc',
            light: '#d1b3ff',
            dark: '#8858cc',
        },
        secondary: {
            main: '#03dac6',
            light: '#66fff7',
            dark: '#00a896',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#404040',
                        },
                        '&:hover fieldset': {
                            borderColor: '#bb86fc',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(145deg, #1e1e1e 0%, #252525 100%)',
                    border: '1px solid #333',
                },
            },
        },
    },
});

const MovieForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState({
        title: '',
        description: '',
        releaseDate: '',
        duration: '',
        directorId: '',
        trailerUrl: '',
        englishTitle: '',
        isAvailable: false,
        posterUrl: '',
        rating: '',
        genreIds: []
    });

    const [genres, setGenres] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [genresLoaded, setGenresLoaded] = useState(false);

    useEffect(() => {
        // Fetch genres
        axios.get('http://localhost:8080/api/admin/genres')
            .then(response => {
                setGenres(response.data.data);
                setGenresLoaded(true);
                if (response.data.data.length === 0) {
                    toast.warn('Không có thể loại nào được tìm thấy. Vui lòng thêm ít nhất một thể loại trước khi thêm phim.');
                }

                // Fetch movie data if editing
                if (id) {
                    axios.get(`http://localhost:8080/api/admin/movies/${id}`)
                        .then(movieResponse => {
                            const movieData = movieResponse.data.data;
                            const formattedReleaseDate = movieData.releaseDate
                                ? new Date(movieData.releaseDate).toISOString().split('T')[0]
                                : '';
                            const genreIdsArray = movieData.genreIds
                                ? Array.from(movieData.genreIds)
                                : [];
                            setMovie({
                                ...movieData,
                                releaseDate: formattedReleaseDate,
                                genreIds: genreIdsArray,
                                directorId: movieData.directorId ? String(movieData.directorId) : '',
                            });
                        })
                        .catch(error => {
                            console.error("Lỗi khi lấy dữ liệu phim:", error);
                            toast.error(error.response?.data?.message || 'Error fetching movie');
                        });
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách thể loại:", error);
                toast.error('Lỗi khi lấy danh sách thể loại');
                setGenresLoaded(true);
            });

        // Fetch directors
        axios.get('http://localhost:8080/api/admin/directors')
            .then(response => {
                setDirectors(response.data);
                console.log("Directors fetched successfully:", response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách đạo diễn:", error);
                toast.error('Lỗi khi lấy danh sách đạo diễn');
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMovie({ ...movie, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const movieToSubmit = {
            ...movie,
            duration: parseInt(movie.duration, 10),
            directorId: parseInt(movie.directorId, 10),
            rating: movie.rating ? parseFloat(movie.rating) : null,
        };

        const request = id
            ? axios.put(`http://localhost:8080/api/admin/movies/${id}`, movieToSubmit)
            : axios.post('http://localhost:8080/api/admin/movies', movieToSubmit);

        request
            .then(response => {
                toast.success(response.data.message);
                navigate('/movies');
            })
            .catch(error => {
                console.error("Lỗi từ backend:", error.response?.data);
                toast.error(error.response?.data?.message || 'Error saving movie');
            });
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ 
                bgcolor: 'background.default', 
                minHeight: '100vh', 
                py: 3,
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
            }}>
                <Card sx={{ maxWidth: 800, margin: 'auto', borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Movie sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                            <Typography variant="h4" sx={{ 
                                background: 'linear-gradient(45deg, #bb86fc, #03dac6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold'
                            }}>
                                {id ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
                            </Typography>
                        </Box>
                        
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/movies')}
                            sx={{ mb: 3 }}
                        >
                            Quay lại danh sách phim
                        </Button>

                        <Divider sx={{ mb: 3, borderColor: '#333' }} />

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {/* Title */}
                                <TextField
                                    label="Tên phim"
                                    name="title"
                                    value={movie.title}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />
                                
                                {/* English Title */}
                                <TextField
                                    label="Tên tiếng Anh"
                                    name="englishTitle"
                                    value={movie.englishTitle}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />

                                {/* Description */}
                                <TextField
                                    label="Mô tả phim"
                                    name="description"
                                    value={movie.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />

                                {/* Release Date */}
                                <TextField
                                    label="Ngày phát hành"
                                    name="releaseDate"
                                    type="date"
                                    value={movie.releaseDate}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />

                                {/* Duration */}
                                <TextField
                                    label="Thời lượng (phút)"
                                    name="duration"
                                    type="number"
                                    value={movie.duration}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: "1", max: "500" }}
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />

                                {/* Director */}
                                <Autocomplete
                                    options={directors}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={directors.find(d => d.id === parseInt(movie.directorId)) || null}
                                    onChange={(event, newValue) => {
                                        setMovie({ ...movie, directorId: newValue ? String(newValue.id) : '' });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Director"
                                            required
                                            fullWidth
                                            sx={{ 
                                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                    PaperComponent={(props) => (
                                        <Paper {...props} sx={{ 
                                            bgcolor: 'background.paper',
                                            border: '1px solid #404040',
                                            borderRadius: 2,
                                            mt: 1
                                        }} />
                                    )}
                                />

                                {/* Rating */}
                                <TextField
                                    label="Đánh giá(0-10)"
                                    name="rating"
                                    type="number"
                                    value={movie.rating}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ step: "0.1", min: "0", max: "10" }}
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />

                                {/* Poster URL */}
                                <TextField
                                    label="Poster URL"
                                    name="posterUrl"
                                    value={movie.posterUrl}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="https://example.com/poster.jpg"
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />

                                {/* Trailer URL */}
                                <TextField
                                    label="Trailer URL"
                                    name="trailerUrl"
                                    value={movie.trailerUrl}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="https://youtube.com/watch?v=..."
                                    sx={{ 
                                        '& .MuiInputLabel-root': { fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                            }
                                        }
                                    }}
                                />

                                {/* Genres */}
                                {genresLoaded ? (
                                    <Autocomplete
                                        multiple
                                        options={genres}
                                        getOptionLabel={(option) => option.name || ''}
                                        value={genres.filter(genre => (movie.genreIds || []).includes(genre.id))}
                                        onChange={(event, newValue) => {
                                            const newGenreIds = newValue.map(genre => genre.id);
                                            setMovie({ ...movie, genreIds: newGenreIds });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Thể loại"
                                                sx={{ 
                                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: '0 4px 12px rgba(187, 134, 252, 0.15)'
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    key={option.id}
                                                    label={option.name}
                                                    {...getTagProps({ index })}
                                                    sx={{ 
                                                        bgcolor: 'primary.main',
                                                        color: 'background.paper',
                                                        fontWeight: 500,
                                                        borderRadius: 2,
                                                        '&:hover': {
                                                            bgcolor: 'primary.dark'
                                                        }
                                                    }}
                                                />
                                            ))
                                        }
                                        PaperComponent={(props) => (
                                            <Paper {...props} sx={{ 
                                                bgcolor: 'background.paper',
                                                border: '1px solid #404040',
                                                borderRadius: 2,
                                                mt: 1
                                            }} />
                                        )}
                                    />
                                ) : (
                                    <Box sx={{ 
                                        p: 2, 
                                        textAlign: 'center',
                                        bgcolor: 'background.default',
                                        borderRadius: 2,
                                        border: '1px solid #404040'
                                    }}>
                                        <Typography color="textSecondary">Loading genres...</Typography>
                                    </Box>
                                )}

                                {/* Availability Toggle */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    p: 2,
                                    bgcolor: 'rgba(187, 134, 252, 0.05)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(187, 134, 252, 0.2)'
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={movie.isAvailable}
                                                onChange={(e) => setMovie({ ...movie, isAvailable: e.target.checked })}
                                                color="secondary"
                                                sx={{
                                                    '& .MuiSwitch-thumb': {
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                                    }
                                                }}
                                            />
                                        }
                                        label="Trạng thái phim"
                                        sx={{ 
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            margin: 0
                                        }}
                                    />
                                </Box>

                                {/* Submit Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/movies')}
                                        sx={{ 
                                            px: 4,
                                            py: 1.2,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(187, 134, 252, 0.25)'
                                            }
                                        }}
                                    >
                                        Thoát
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={id ? <Save /> : <Add />}
                                        sx={{ 
                                            px: 4,
                                            py: 1.2,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            background: 'linear-gradient(45deg, #bb86fc, #03dac6)',
                                            boxShadow: '0 4px 15px rgba(187, 134, 252, 0.4)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #8858cc, #00a896)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(187, 134, 252, 0.6)'
                                            }
                                        }}
                                    >
                                        {id ? 'Cập nhật phim' : 'Thêm phim mới'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default MovieForm;
    // return (
    //     <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
    //         <Typography variant="h4" gutterBottom>
    //             {id ? 'Edit Movie' : 'Add Movie'}
    //         </Typography>
    //         <Button
    //             variant="outlined"
    //             color="secondary"
    //             onClick={() => navigate('/movies')}
    //             >
    //              Cancel
    //          </Button>
    //         <form onSubmit={handleSubmit}>
    //             <TextField
    //                 label="Title"
    //                 name="title"
    //                 value={movie.title}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //                 required
    //             />
    //             <TextField
    //                 label="Description"
    //                 name="description"
    //                 value={movie.description}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //                 multiline
    //                 rows={4}
    //                 required
    //             />
    //             <TextField
    //                 label="Release Date"
    //                 name="releaseDate"
    //                 type="date"
    //                 value={movie.releaseDate}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //                 InputLabelProps={{ shrink: true }}
    //                 required
    //             />
    //             <TextField
    //                 label="Duration (minutes)"
    //                 name="duration"
    //                 type="number"
    //                 value={movie.duration}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //                 required
    //             />
    //             <Autocomplete
    //                 options={directors}
    //                 getOptionLabel={(option) => option.name}
    //                 value={directors.find(d => d.id === parseInt(movie.directorId)) || null}
    //                 onChange={(event, newValue) => {
    //                     setMovie({ ...movie, directorId: newValue ? String(newValue.id) : '' });
    //                 }}
    //                 renderInput={(params) => (
    //                     <TextField
    //                         {...params}
    //                         label="Director"
    //                         margin="normal"
    //                         required
    //                         fullWidth
    //                     />
    //                 )}
    //             />
    //             <TextField
    //                 label="Trailer URL"
    //                 name="trailerUrl"
    //                 value={movie.trailerUrl}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //             />
    //             <TextField
    //                 label="English Title"
    //                 name="englishTitle"
    //                 value={movie.englishTitle}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //             />
    //             <TextField
    //                 label="Poster URL"
    //                 name="posterUrl"
    //                 value={movie.posterUrl}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //             />
    //             <TextField
    //                 label="Rating"
    //                 name="rating"
    //                 type="number"
    //                 value={movie.rating}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //                 inputProps={{ step: "0.1" }}
    //             />
    //             <TextField
    //                 label="Is Available"
    //                 name="isAvailable"
    //                 type="checkbox"
    //                 checked={movie.isAvailable}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 margin="normal"
    //             />
    //             {genresLoaded ? (
    //                 <Autocomplete
    //                     multiple
    //                     options={genres}
    //                     getOptionLabel={(option) => option.name}
    //                     value={genres.filter(genre => (movie.genreIds || []).includes(genre.id))}
    //                     onChange={(event, newValue) => {
    //                         const newGenreIds = newValue.map(genre => genre.id);
    //                         setMovie({ ...movie, genreIds: newGenreIds });
    //                     }}
    //                     renderInput={(params) => (
    //                         <TextField
    //                             {...params}
    //                             label="Genres"
    //                             margin="normal"
    //                         />
    //                     )}
    //                     renderTags={(value, getTagProps) =>
    //                         value.map((option, index) => (
    //                             <Chip
    //                                 key={option.id}
    //                                 label={option.name}
    //                                 onDelete={() => {
    //                                     const newGenreIds = movie.genreIds.filter(id => id !== option.id);
    //                                     setMovie({ ...movie, genreIds: newGenreIds });
    //                                 }}
    //                                 {...getTagProps({ index })}
    //                             />
    //                         ))
    //                     }
    //                 />
    //             ) : (
    //                 <Typography color="textSecondary">Loading genres...</Typography>
    //             )}
    //             <Button
    //                 type="submit"
    //                 variant="contained"
    //                 color="primary"
    //                 sx={{ marginTop: 2 }}
    //             >
    //                 {id ? 'Update' : 'Add'}
    //             </Button>
    //         </form>
    //     </Box>
    // );