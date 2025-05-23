package com.example.DemoAdmin.service.voucher;

import com.example.DemoAdmin.dto.request.VoucherRequest;
import com.example.DemoAdmin.dto.response.VoucherResponse;
import com.example.DemoAdmin.entity.VoucherUser;

import java.util.List;

public interface IVoucherService {
    VoucherResponse createVoucher(VoucherRequest request);
    VoucherResponse updateVoucher(Integer id, VoucherRequest request);
    VoucherResponse getVoucherById(Integer id);
    List<VoucherResponse> getAllVouchers();
    List<VoucherResponse> getVoucherByBrand(Integer theaterBrandId);
    boolean getVoucherIsUsed(Integer id); // Đổi tên thành getVoucherIsUsed
}