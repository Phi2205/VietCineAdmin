package com.example.DemoAdmin;

import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;
import com.example.DemoAdmin.entity.Movie;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.Showtime;
import com.example.DemoAdmin.mapper.IShowtimeMapper;
import com.example.DemoAdmin.repository.IMovieRepository;
import com.example.DemoAdmin.repository.IScreenRepository;
import com.example.DemoAdmin.repository.IShowtimeRepository;
import com.example.DemoAdmin.service.showtime.ShowtimeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ShowtimeServiceTest {
    @Mock
    private IShowtimeRepository showtimeRepository;
    @Mock
    private IMovieRepository movieRepository;
    @Mock
    private IScreenRepository screenRepository;
    @Mock
    private IShowtimeMapper showtimeMapper;

    @InjectMocks
    private ShowtimeService showtimeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateShowtime_Success() {
        ShowtimeRequest request = new ShowtimeRequest();
        request.setMovieId(1);
        request.setScreenId(2);
        request.setStartTime(java.time.Instant.now());

        Movie movie = new Movie();
        movie.setId(1);
        movie.setDuration(120);
        Screen screen = new Screen();
        screen.setId(2);
        Showtime showtime = new Showtime();
        Showtime savedShowtime = new Showtime();
        ShowtimeResponse response = new ShowtimeResponse();

        when(movieRepository.findById(1)).thenReturn(Optional.of(movie));
        when(screenRepository.findById(2)).thenReturn(Optional.of(screen));
        when(showtimeMapper.toShowtime(request)).thenReturn(showtime);
        when(showtimeRepository.save(any(Showtime.class))).thenReturn(savedShowtime);
        when(showtimeMapper.toShowtimeResponse(savedShowtime)).thenReturn(response);

        ShowtimeResponse result = showtimeService.createShowtime(request);
        assertEquals(response, result);
        verify(showtimeRepository).save(any(Showtime.class));
    }

    @Test
    void testCreateShowtime_MovieNotFound() {
        ShowtimeRequest request = new ShowtimeRequest();
        request.setMovieId(1);
        request.setScreenId(2);
        when(movieRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () -> showtimeService.createShowtime(request));
        assertTrue(ex.getMessage().contains("Movie not found"));
    }

    @Test
    void testCreateShowtime_ScreenNotFound() {
        ShowtimeRequest request = new ShowtimeRequest();
        request.setMovieId(1);
        request.setScreenId(2);
        Movie movie = new Movie();
        movie.setId(1);
        when(movieRepository.findById(1)).thenReturn(Optional.of(movie));
        when(screenRepository.findById(2)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () -> showtimeService.createShowtime(request));
        assertTrue(ex.getMessage().contains("Screen not found"));
    }

    @Test
    void testGetAllShowtimes() {
        Showtime showtime1 = new Showtime();
        Showtime showtime2 = new Showtime();
        ShowtimeResponse resp1 = new ShowtimeResponse();
        ShowtimeResponse resp2 = new ShowtimeResponse();
        when(showtimeRepository.findAll()).thenReturn(Arrays.asList(showtime1, showtime2));
        when(showtimeMapper.toShowtimeResponse(showtime1)).thenReturn(resp1);
        when(showtimeMapper.toShowtimeResponse(showtime2)).thenReturn(resp2);
        List<ShowtimeResponse> result = showtimeService.getAllShowtimes();
        assertEquals(2, result.size());
        assertTrue(result.contains(resp1));
        assertTrue(result.contains(resp2));
    }

    @Test
    void testGetShowtimeById_Success() {
        Showtime showtime = new Showtime();
        ShowtimeResponse response = new ShowtimeResponse();
        when(showtimeRepository.findById(1)).thenReturn(Optional.of(showtime));
        when(showtimeMapper.toShowtimeResponse(showtime)).thenReturn(response);
        ShowtimeResponse result = showtimeService.getShowtimeById(1);
        assertEquals(response, result);
    }

    @Test
    void testGetShowtimeById_NotFound() {
        when(showtimeRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () -> showtimeService.getShowtimeById(1));
        assertTrue(ex.getMessage().contains("Showtime not found"));
    }

    @Test
    void testUpdateShowtime_Success() {
        ShowtimeRequest request = new ShowtimeRequest();
        request.setMovieId(1);
        request.setScreenId(2);
        request.setStartTime(java.time.Instant.now());
        Showtime showtime = new Showtime();
        Movie movie = new Movie();
        movie.setId(1);
        movie.setDuration(120);
        Screen screen = new Screen();
        screen.setId(2);
        Showtime updatedShowtime = new Showtime();
        ShowtimeResponse response = new ShowtimeResponse();
        when(showtimeRepository.findById(1)).thenReturn(Optional.of(showtime));
        when(movieRepository.findById(1)).thenReturn(Optional.of(movie));
        when(screenRepository.findById(2)).thenReturn(Optional.of(screen));
        when(showtimeRepository.save(any(Showtime.class))).thenReturn(updatedShowtime);
        when(showtimeMapper.toShowtimeResponse(updatedShowtime)).thenReturn(response);
        ShowtimeResponse result = showtimeService.updateShowtime(1, request);
        assertEquals(response, result);
    }

    @Test
    void testUpdateShowtime_NotFound() {
        ShowtimeRequest request = new ShowtimeRequest();
        when(showtimeRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () -> showtimeService.updateShowtime(1, request));
        assertTrue(ex.getMessage().contains("Showtime not found"));
    }

    @Test
    void testDeleteShowtime_Success() {
        Showtime showtime = new Showtime();
        when(showtimeRepository.findById(1)).thenReturn(Optional.of(showtime));
        doNothing().when(showtimeRepository).delete(showtime);
        showtimeService.deleteShowtime(1);
        verify(showtimeRepository).delete(showtime);
    }

    @Test
    void testDeleteShowtime_NotFound() {
        when(showtimeRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () -> showtimeService.deleteShowtime(1));
        assertTrue(ex.getMessage().contains("Showtime not found"));
    }
} 