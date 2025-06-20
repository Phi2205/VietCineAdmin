package com.example.DemoAdmin;

import com.example.DemoAdmin.dto.request.PriceAdjustmentRequest;
import com.example.DemoAdmin.dto.request.VoucherRequest;
import com.example.DemoAdmin.dto.response.PriceAdjustmentResponse;
import com.example.DemoAdmin.dto.response.VoucherResponse;
import com.example.DemoAdmin.entity.PriceAdjustment;
import com.example.DemoAdmin.entity.SeatType;
import com.example.DemoAdmin.entity.TheaterBrand;
import com.example.DemoAdmin.entity.User;
import com.example.DemoAdmin.entity.Voucher;
import com.example.DemoAdmin.entity.VoucherUser;
import com.example.DemoAdmin.mapper.IPriceAdjustmentMapper;
import com.example.DemoAdmin.mapper.IVoucherMapper;
import com.example.DemoAdmin.repository.*;
import com.example.DemoAdmin.service.priceAdjustment.PriceAdjustmentService;
import com.example.DemoAdmin.service.voucher.VoucherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PriceAdjustmentAndVoucherServiceTest {
    // PriceAdjustmentService mocks
    @Mock private IPriceAdjustmentRepository priceAdjustmentRepository;
    @Mock private ISeatTypeRepository seatTypeRepository;
    @Mock private IPriceAdjustmentMapper priceAdjustmentMapper;
    @InjectMocks private PriceAdjustmentService priceAdjustmentService;

    // VoucherService mocks
    @Mock private IVoucherRepository voucherRepository;
    @Mock private IVoucherUserRepository voucherUserRepository;
    @Mock private IUserRepository userRepository;
    @Mock private ITheaterBrandRepository theaterBrandRepository;
    @Mock private IVoucherMapper voucherMapper;
    @InjectMocks private VoucherService voucherService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- PriceAdjustmentService tests ---
    @Test
    void testCreatePriceAdjustment_Success_DayOfWeek() {
        PriceAdjustmentRequest req = new PriceAdjustmentRequest();
        req.setSeatTypeId(1);
        req.setDayOfWeek("Monday");
        req.setIsActive(true);
        SeatType seatType = new SeatType();
        seatType.setSeatTypeId(1);
        PriceAdjustment pa = new PriceAdjustment();
        PriceAdjustment saved = new PriceAdjustment();
        PriceAdjustmentResponse resp = new PriceAdjustmentResponse();
        when(seatTypeRepository.findById(1)).thenReturn(Optional.of(seatType));
        when(priceAdjustmentRepository.findAll()).thenReturn(Collections.emptyList());
        when(priceAdjustmentMapper.toPriceAdjustment(req)).thenReturn(pa);
        when(priceAdjustmentRepository.save(any())).thenReturn(saved);
        when(priceAdjustmentMapper.toPriceAdjustmentResponse(saved)).thenReturn(resp);
        PriceAdjustmentResponse result = priceAdjustmentService.createPriceAdjustment(req);
        assertEquals(resp, result);
    }

    @Test
    void testCreatePriceAdjustment_Fail_BothSpecificDateAndDayOfWeek() {
        PriceAdjustmentRequest req = new PriceAdjustmentRequest();
        req.setSeatTypeId(1);
        req.setDayOfWeek("Monday");
        req.setSpecificDate(new Date());
        when(seatTypeRepository.findById(1)).thenReturn(Optional.of(new SeatType()));
        Exception ex = assertThrows(RuntimeException.class, () -> priceAdjustmentService.createPriceAdjustment(req));
        assertTrue(ex.getMessage().contains("Chỉ được cung cấp specificDate hoặc dayOfWeek"));
    }

    @Test
    void testCreatePriceAdjustment_Fail_InvalidDayOfWeek() {
        PriceAdjustmentRequest req = new PriceAdjustmentRequest();
        req.setSeatTypeId(1);
        req.setDayOfWeek("Funday");
        when(seatTypeRepository.findById(1)).thenReturn(Optional.of(new SeatType()));
        Exception ex = assertThrows(RuntimeException.class, () -> priceAdjustmentService.createPriceAdjustment(req));
        assertTrue(ex.getMessage().contains("DayOfWeek phải là một trong"));
    }

    @Test
    void testCreatePriceAdjustment_Fail_ValidFromAfterUntil() {
        PriceAdjustmentRequest req = new PriceAdjustmentRequest();
        req.setSeatTypeId(1);
        req.setDayOfWeek("Monday");
        req.setValidFrom(new Date(200000));
        req.setUntil(new Date(100000));
        when(seatTypeRepository.findById(1)).thenReturn(Optional.of(new SeatType()));
        Exception ex = assertThrows(RuntimeException.class, () -> priceAdjustmentService.createPriceAdjustment(req));
        assertTrue(ex.getMessage().contains("Ngày bắt đầu (validFrom) phải trước ngày kết thúc (until)"));
    }

    @Test
    void testGetAllPriceAdjustments() {
        PriceAdjustment pa1 = new PriceAdjustment();
        PriceAdjustment pa2 = new PriceAdjustment();
        PriceAdjustmentResponse resp1 = new PriceAdjustmentResponse();
        PriceAdjustmentResponse resp2 = new PriceAdjustmentResponse();
        when(priceAdjustmentRepository.findAll()).thenReturn(Arrays.asList(pa1, pa2));
        when(priceAdjustmentMapper.toPriceAdjustmentResponse(pa1)).thenReturn(resp1);
        when(priceAdjustmentMapper.toPriceAdjustmentResponse(pa2)).thenReturn(resp2);
        List<PriceAdjustmentResponse> result = priceAdjustmentService.getAllPriceAdjustments();
        assertEquals(2, result.size());
        assertTrue(result.contains(resp1));
        assertTrue(result.contains(resp2));
    }

    // --- VoucherService tests ---
    @Test
    void testCreateVoucher_Success() {
        VoucherRequest req = new VoucherRequest();
        req.setTheaterBrandId(1);
        TheaterBrand brand = new TheaterBrand();
        brand.setTheaterBrandId(1);
        Voucher voucher = new Voucher();
        Voucher saved = new Voucher();
        VoucherResponse resp = new VoucherResponse();
        User user = new User();
        when(theaterBrandRepository.findById(1)).thenReturn(Optional.of(brand));
        when(voucherMapper.toVoucher(req)).thenReturn(voucher);
        when(voucherRepository.save(any())).thenReturn(saved);
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));
        when(voucherMapper.toVoucherResponse(saved)).thenReturn(resp);
        VoucherResponse result = voucherService.createVoucher(req);
        assertEquals(resp, result);
    }

    @Test
    void testUpdateVoucher_Fail_NotFound() {
        VoucherRequest req = new VoucherRequest();
        when(voucherRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () -> voucherService.updateVoucher(1, req));
        assertTrue(ex.getMessage().contains("Voucher not found"));
    }

    @Test
    void testGetAllVouchers() {
        Voucher v1 = new Voucher();
        Voucher v2 = new Voucher();
        VoucherResponse r1 = new VoucherResponse();
        VoucherResponse r2 = new VoucherResponse();
        when(voucherRepository.findAll()).thenReturn(Arrays.asList(v1, v2));
        when(voucherMapper.toVoucherResponse(v1)).thenReturn(r1);
        when(voucherMapper.toVoucherResponse(v2)).thenReturn(r2);
        List<VoucherResponse> result = voucherService.getAllVouchers();
        assertEquals(2, result.size());
        assertTrue(result.contains(r1));
        assertTrue(result.contains(r2));
    }

    @Test
    void testGetVoucherIsUsed_True() {
        when(voucherUserRepository.existsByVoucherIdAndIsUsed(1, true)).thenReturn(true);
        assertTrue(voucherService.getVoucherIsUsed(1));
    }

    @Test
    void testGetVoucherIsUsed_False() {
        when(voucherUserRepository.existsByVoucherIdAndIsUsed(1, true)).thenReturn(false);
        assertFalse(voucherService.getVoucherIsUsed(1));
    }
} 