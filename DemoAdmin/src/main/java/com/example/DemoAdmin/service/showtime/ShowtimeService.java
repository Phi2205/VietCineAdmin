package com.example.DemoAdmin.service.showtime;

import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;
import com.example.DemoAdmin.entity.Movie;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.Showtime;
import com.example.DemoAdmin.entity.Theater;
import com.example.DemoAdmin.mapper.IShowtimeMapper;
import com.example.DemoAdmin.repository.IMovieRepository;
import com.example.DemoAdmin.repository.IScreenRepository;
import com.example.DemoAdmin.repository.IShowtimeRepository;
import com.example.DemoAdmin.repository.ITheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeService {

    private final IShowtimeRepository showtimeRepository;
    private final IMovieRepository movieRepository;
    private final IScreenRepository screenRepository;
    private final IShowtimeMapper showtimeMapper;

    // Tạo suất chiếu mới
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        // Kiểm tra movieId và screenId có tồn tại không
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + request.getMovieId()));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + request.getScreenId()));
        // Chuyển từ ShowtimeRequest sang Showtime entity
        Showtime showtime = showtimeMapper.toShowtime(request);
        showtime.setMovie(movie);
        showtime.setScreen(screen);
        showtime.setStartTime(request.getStartTime());
        showtime.setEndTime(request.getStartTime().plus(Duration.ofMinutes(movie.getDuration())));

        // Lưu vào database
        Showtime savedShowtime = showtimeRepository.save(showtime);

        // Chuyển từ Showtime entity sang ShowtimeResponse
        return showtimeMapper.toShowtimeResponse(savedShowtime);
    }

    // Lấy danh sách tất cả suất chiếu
    public List<ShowtimeResponse> getAllShowtimes() {
        return showtimeRepository.findAll().stream()
                .map(showtimeMapper::toShowtimeResponse)
                .collect(Collectors.toList());
    }

    // Lấy suất chiếu theo ID
    public ShowtimeResponse getShowtimeById(Integer id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));
        return showtimeMapper.toShowtimeResponse(showtime);
    }

    // Cập nhật suất chiếu
    public ShowtimeResponse updateShowtime(Integer id, ShowtimeRequest request) {
        // Kiểm tra suất chiếu có tồn tại không
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));

        // Kiểm tra movieId và screenId
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + request.getMovieId()));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + request.getScreenId()));

        // Cập nhật thông tin suất chiếu
        showtime.setMovie(movie);
        showtime.setScreen(screen);
        showtime.setStartTime(request.getStartTime());
        showtime.setEndTime(request.getStartTime().plus(Duration.ofMinutes(movie.getDuration())));

        // Lưu vào database
        Showtime updatedShowtime = showtimeRepository.save(showtime);

        // Chuyển sang ShowtimeResponse
        return showtimeMapper.toShowtimeResponse(updatedShowtime);
    }

    // Xóa suất chiếu
    public void deleteShowtime(Integer id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));
        showtimeRepository.delete(showtime);
    }
}