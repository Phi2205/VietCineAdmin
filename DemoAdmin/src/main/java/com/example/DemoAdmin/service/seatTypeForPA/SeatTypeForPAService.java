package com.example.DemoAdmin.service.seatTypeForPA;

import com.example.DemoAdmin.dto.response.SeatTypeForPAResponse;
import com.example.DemoAdmin.entity.SeatType;
import com.example.DemoAdmin.mapper.ISeatTypeForPAMapper;
import com.example.DemoAdmin.repository.ISeatTypeForPARepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SeatTypeForPAService implements ISeatTypeForPAService {

    private final ISeatTypeForPARepository seatTypeForPARepository;
    private final ISeatTypeForPAMapper seatTypeForPAMapper;

    @Override
    public List<SeatTypeForPAResponse> getAllSeatTypes() {
        List<SeatType> seatTypes = seatTypeForPARepository.findAll();
        return seatTypes.stream()
                .map(seatTypeForPAMapper::toSeatTypeForPAResponse)
                .collect(Collectors.toList());
    }
}