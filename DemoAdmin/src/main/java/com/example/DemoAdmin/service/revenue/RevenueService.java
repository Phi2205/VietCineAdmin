// RevenueService.java
package com.example.DemoAdmin.service.revenue;

import com.example.DemoAdmin.dto.response.RevenueDetailDTO;
import com.example.DemoAdmin.dto.request.RevenueFilterRequest;
import com.example.DemoAdmin.dto.response.RevenueResponse;
import com.example.DemoAdmin.repository.IRevenueRepository;
import com.example.DemoAdmin.service.revenue.IRevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueService implements IRevenueService {

    private final IRevenueRepository revenueRepository;

    @Override
    public RevenueResponse getRevenueByAll(RevenueFilterRequest request) {
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        Integer theaterId = request.getTheaterId();
        Integer movieId = request.getMovieId();

        List<Object[]> rawData = revenueRepository.findRevenueByAllNative(startDate, endDate, theaterId, movieId);

        List<RevenueDetailDTO> details = new ArrayList<>();
        long total = 0;

        for (Object[] row : rawData) {
            String label = (String) row[0];
            Long amount = ((Number) row[1]).longValue();
            details.add(new RevenueDetailDTO(label, amount));
            total += amount;
        }

        RevenueResponse response = new RevenueResponse();
        response.setDetails(details);
        response.setTotalRevenue(total);
        return response;
    }
}
