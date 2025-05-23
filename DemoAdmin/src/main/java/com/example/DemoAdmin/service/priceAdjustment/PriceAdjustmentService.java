package com.example.DemoAdmin.service.priceAdjustment;

import com.example.DemoAdmin.dto.request.PriceAdjustmentRequest;
import com.example.DemoAdmin.dto.response.PriceAdjustmentResponse;
import com.example.DemoAdmin.entity.PriceAdjustment;
import com.example.DemoAdmin.entity.SeatType;
import com.example.DemoAdmin.mapper.IPriceAdjustmentMapper;
import com.example.DemoAdmin.repository.IPriceAdjustmentRepository;
import com.example.DemoAdmin.repository.ISeatTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PriceAdjustmentService implements IPriceAdjustmentService {

    private final IPriceAdjustmentRepository priceAdjustmentRepository;
    private final ISeatTypeRepository seatTypeRepository;
    private final IPriceAdjustmentMapper priceAdjustmentMapper;

    private static final List<String> VALID_DAYS_OF_WEEK = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    private static final SimpleDateFormat DATE_FORMATTER = new SimpleDateFormat("yyyy-MM-dd");
    static {
        DATE_FORMATTER.setTimeZone(TimeZone.getTimeZone("GMT+07:00")); // Đặt múi giờ UTC+7
    }

    @Override
    public PriceAdjustmentResponse createPriceAdjustment(PriceAdjustmentRequest request) {
        // Kiểm tra chỉ một trong specificDate hoặc dayOfWeek được cung cấp
        if (request.getSpecificDate() != null && request.getDayOfWeek() != null) {
            throw new RuntimeException("Chỉ được cung cấp specificDate hoặc dayOfWeek, không được cả hai.");
        }
        if (request.getDayOfWeek() != null && !VALID_DAYS_OF_WEEK.contains(request.getDayOfWeek())) {
            throw new RuntimeException("DayOfWeek phải là một trong: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.");
        }

        SeatType seatType = seatTypeRepository.findById(request.getSeatTypeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SeatType với id: " + request.getSeatTypeId()));

        // Lấy ngày hiện tại từ hệ thống
        Date currentDate = new Date();

        // Chuẩn hóa specificDate từ request
        Date normalizedSpecificDate = null;
        if (request.getSpecificDate() != null) {
            try {
                String dateStr = DATE_FORMATTER.format(request.getSpecificDate());
                normalizedSpecificDate = DATE_FORMATTER.parse(dateStr); // Chuẩn hóa lại với UTC+7
            } catch (ParseException e) {
                throw new RuntimeException("Định dạng ngày không hợp lệ: " + e.getMessage());
            }
        }

        // Kiểm tra trùng lặp với specificDate hoặc dayOfWeek khi isActive = true
        List<PriceAdjustment> existingAdjustments = priceAdjustmentRepository.findAll().stream()
                .filter(a -> a.getSeatTypeId().equals(request.getSeatTypeId()))
                .collect(Collectors.toList());

        if (normalizedSpecificDate != null) {
            String requestDateStr = DATE_FORMATTER.format(normalizedSpecificDate);
            boolean hasActiveWithSameDate = existingAdjustments.stream()
                    .anyMatch(a -> {
                        if (a.getSpecificDate() != null && a.getIsActive()) {
                            String existingDateStr = DATE_FORMATTER.format(a.getSpecificDate());
                            return existingDateStr.equals(requestDateStr);
                        }
                        return false;
                    });
            if (hasActiveWithSameDate) {
                throw new RuntimeException("Đã có điều chỉnh giá đang Active cho SeatType này với ngày đặc biệt này.");
            }
        } else if (request.getDayOfWeek() != null) {
            boolean hasActiveWithSameDay = existingAdjustments.stream()
                    .anyMatch(a -> a.getDayOfWeek() != null &&
                            a.getDayOfWeek().equalsIgnoreCase(request.getDayOfWeek()) &&
                            a.getIsActive());
            if (hasActiveWithSameDay) {
                throw new RuntimeException("Đã có điều chỉnh giá đang Active cho SeatType này với ngày trong tuần này.");
            }
        }

        PriceAdjustment priceAdjustment = priceAdjustmentMapper.toPriceAdjustment(request);
        priceAdjustment.setSeatTypeId(request.getSeatTypeId());
        priceAdjustment.setSpecificDate(normalizedSpecificDate); // Sử dụng giá trị đã chuẩn hóa
        priceAdjustment.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        PriceAdjustment savedAdjustment = priceAdjustmentRepository.save(priceAdjustment);
        return priceAdjustmentMapper.toPriceAdjustmentResponse(savedAdjustment);
    }

    @Override
    public PriceAdjustmentResponse updatePriceAdjustment(Integer id, PriceAdjustmentRequest request) {
        PriceAdjustment priceAdjustment = priceAdjustmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy PriceAdjustment với id: " + id));

        SeatType seatType = seatTypeRepository.findById(request.getSeatTypeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SeatType với id: " + request.getSeatTypeId()));

        // Kiểm tra chỉ một trong specificDate hoặc dayOfWeek được cung cấp
        if (request.getSpecificDate() != null && request.getDayOfWeek() != null) {
            throw new RuntimeException("Chỉ được cung cấp specificDate hoặc dayOfWeek, không được cả hai.");
        }
        if (request.getDayOfWeek() != null && !VALID_DAYS_OF_WEEK.contains(request.getDayOfWeek())) {
            throw new RuntimeException("DayOfWeek phải là một trong: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.");
        }

        // Lấy ngày hiện tại từ hệ thống
        Date currentDate = new Date();

        // Chuẩn hóa specificDate từ request
        Date normalizedSpecificDate = priceAdjustment.getSpecificDate(); // Giữ nguyên giá trị hiện tại
        if (request.getSpecificDate() != null) {
            try {
                String dateStr = DATE_FORMATTER.format(request.getSpecificDate());
                normalizedSpecificDate = DATE_FORMATTER.parse(dateStr); // Chuẩn hóa lại với UTC+7
            } catch (ParseException e) {
                throw new RuntimeException("Định dạng ngày không hợp lệ: " + e.getMessage());
            }
        }

        // Kiểm tra trùng lặp nếu bật isActive
        boolean willBeActive = request.getIsActive() != null ? request.getIsActive() : priceAdjustment.getIsActive();
        if (willBeActive) {
            List<PriceAdjustment> existingAdjustments = priceAdjustmentRepository.findAll().stream()
                    .filter(a -> a.getSeatTypeId().equals(request.getSeatTypeId()) && !a.getAdjustmentId().equals(id))
                    .collect(Collectors.toList());

            if (normalizedSpecificDate != null) {
                String requestDateStr = DATE_FORMATTER.format(normalizedSpecificDate);
                boolean hasActiveWithSameDate = existingAdjustments.stream()
                        .anyMatch(a -> {
                            if (a.getSpecificDate() != null && a.getIsActive()) {
                                String existingDateStr = DATE_FORMATTER.format(a.getSpecificDate());
                                return existingDateStr.equals(requestDateStr);
                            }
                            return false;
                        });
                if (hasActiveWithSameDate) {
                    throw new RuntimeException("Đã có điều chỉnh giá đang Active cho SeatType này với ngày đặc biệt này.");
                }
            } else if (priceAdjustment.getDayOfWeek() != null) {
                boolean hasActiveWithSameDay = existingAdjustments.stream()
                        .anyMatch(a -> a.getDayOfWeek() != null &&
                                a.getDayOfWeek().equalsIgnoreCase(priceAdjustment.getDayOfWeek()) &&
                                a.getIsActive());
                if (hasActiveWithSameDay) {
                    throw new RuntimeException("Đã có điều chỉnh giá đang Active cho SeatType này với ngày trong tuần này.");
                }
            }
        }

        // Kiểm tra hiệu lực dựa trên specificDate
        if (normalizedSpecificDate != null) {
            String specificDateStr = DATE_FORMATTER.format(normalizedSpecificDate);
            String currentDateStr = DATE_FORMATTER.format(currentDate);

            boolean isPastOrCurrent = !(specificDateStr.compareTo(currentDateStr) > 0);
            if (isPastOrCurrent) {
                // Đã đến hoặc quá specificDate, chỉ cho phép cập nhật isActive
                priceAdjustment.setIsActive(request.getIsActive() != null ? request.getIsActive() : priceAdjustment.getIsActive());
            } else {
                // Chưa đến specificDate, cho phép cập nhật tất cả
                priceAdjustment.setSeatTypeId(request.getSeatTypeId());
                priceAdjustment.setDescription(request.getDescription() != null ? request.getDescription() : priceAdjustment.getDescription());
                priceAdjustment.setDayOfWeek(request.getDayOfWeek() != null ? request.getDayOfWeek() : priceAdjustment.getDayOfWeek());
                priceAdjustment.setSpecificDate(normalizedSpecificDate);
                priceAdjustment.setPriceIncrease(request.getPriceIncrease() != null ? request.getPriceIncrease() : priceAdjustment.getPriceIncrease());
                priceAdjustment.setIsActive(request.getIsActive() != null ? request.getIsActive() : priceAdjustment.getIsActive());
            }
        } else {
            // Nếu không có specificDate, cho phép cập nhật tất cả
            priceAdjustment.setSeatTypeId(request.getSeatTypeId());
            priceAdjustment.setDescription(request.getDescription() != null ? request.getDescription() : priceAdjustment.getDescription());
            priceAdjustment.setDayOfWeek(request.getDayOfWeek() != null ? request.getDayOfWeek() : priceAdjustment.getDayOfWeek());
            priceAdjustment.setSpecificDate(normalizedSpecificDate);
            priceAdjustment.setPriceIncrease(request.getPriceIncrease() != null ? request.getPriceIncrease() : priceAdjustment.getPriceIncrease());
            priceAdjustment.setIsActive(request.getIsActive() != null ? request.getIsActive() : priceAdjustment.getIsActive());
        }

        PriceAdjustment updatedAdjustment = priceAdjustmentRepository.save(priceAdjustment);
        return priceAdjustmentMapper.toPriceAdjustmentResponse(updatedAdjustment);
    }

    @Override
    public PriceAdjustmentResponse getPriceAdjustmentById(Integer id) {
        PriceAdjustment priceAdjustment = priceAdjustmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy PriceAdjustment với id: " + id));
        return priceAdjustmentMapper.toPriceAdjustmentResponse(priceAdjustment);
    }

    @Override
    public List<PriceAdjustmentResponse> getAllPriceAdjustments() {
        return priceAdjustmentRepository.findAll().stream()
                .map(priceAdjustmentMapper::toPriceAdjustmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PriceAdjustmentResponse> getPriceAdjustmentsBySeatType(Integer seatTypeId) {
        seatTypeRepository.findById(seatTypeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SeatType với id: " + seatTypeId));
        List<PriceAdjustment> adjustments = priceAdjustmentRepository.findAll().stream()
                .filter(a -> a.getSeatTypeId().equals(seatTypeId))
                .collect(Collectors.toList());
        return adjustments.stream()
                .map(priceAdjustmentMapper::toPriceAdjustmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAdjustmentActive(Integer id) {
        PriceAdjustment priceAdjustment = priceAdjustmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy PriceAdjustment với id: " + id));

        if (!priceAdjustment.getIsActive()) {
            return false;
        }

        // Lấy ngày hiện tại từ hệ thống
        Date currentDate = new Date();

        // Kiểm tra specificDate
        if (priceAdjustment.getSpecificDate() != null) {
            String specificDateStr = DATE_FORMATTER.format(priceAdjustment.getSpecificDate());
            String currentDateStr = DATE_FORMATTER.format(currentDate);
            return !(specificDateStr.compareTo(currentDateStr) > 0); // Đã đến hoặc quá ngày
        }

        // Kiểm tra dayOfWeek
        if (priceAdjustment.getDayOfWeek() != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(currentDate);
            int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
            String currentDayOfWeek = VALID_DAYS_OF_WEEK.get(dayOfWeek - 1); // Calendar.DAY_OF_WEEK bắt đầu từ 1 (Sunday)
            return priceAdjustment.getDayOfWeek().equalsIgnoreCase(currentDayOfWeek);
        }

        return true; // Nếu không có specificDate hoặc dayOfWeek, coi như luôn hiệu lực
    }
}