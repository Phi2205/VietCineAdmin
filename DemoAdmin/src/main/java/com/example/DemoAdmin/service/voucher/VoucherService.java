package com.example.DemoAdmin.service.voucher;

import com.example.DemoAdmin.dto.request.VoucherRequest;
import com.example.DemoAdmin.dto.response.VoucherResponse;
import com.example.DemoAdmin.entity.TheaterBrand;
import com.example.DemoAdmin.entity.User;
import com.example.DemoAdmin.entity.Voucher;
import com.example.DemoAdmin.entity.VoucherUser;
import com.example.DemoAdmin.mapper.IVoucherMapper;
import com.example.DemoAdmin.repository.ITheaterBrandRepository;
import com.example.DemoAdmin.repository.IUserRepository;
import com.example.DemoAdmin.repository.IVoucherRepository;
import com.example.DemoAdmin.repository.IVoucherUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class VoucherService implements IVoucherService {

    private final IVoucherRepository voucherRepository;
    private final IVoucherUserRepository voucherUserRepository;
    private final IUserRepository userRepository;
    private final ITheaterBrandRepository theaterBrandRepository;
    private final IVoucherMapper voucherMapper;

    @Override
    public VoucherResponse createVoucher(VoucherRequest request) {
        TheaterBrand theaterBrand = theaterBrandRepository.findById(request.getTheaterBrandId())
                .orElseThrow(() -> new RuntimeException("TheaterBrand not found with id: " + request.getTheaterBrandId()));

        Voucher voucher = voucherMapper.toVoucher(request);
        voucher.setTheaterBrand(theaterBrand);
        voucher.setIsActive(true); // Đặt mặc định isActive = true khi tạo mới

        Voucher savedVoucher = voucherRepository.save(voucher);

        List<User> users = userRepository.findAll();
        for (User user : users) {
            VoucherUser voucherUser = new VoucherUser();
            voucherUser.setVoucher(savedVoucher);
            voucherUser.setUser(user);
            voucherUser.setIsUsed(false);
            voucherUserRepository.save(voucherUser);
        }

        return voucherMapper.toVoucherResponse(savedVoucher);
    }

    @Override
    public VoucherResponse updateVoucher(Integer id, VoucherRequest request) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));

        // Kiểm tra xem voucher đã được sử dụng chưa
        boolean isUsed = voucherUserRepository.existsByVoucherIdAndIsUsed(id, true);

        if (isUsed) {
            // Nếu đã được sử dụng, chỉ cập nhật isActive
            voucher.setIsActive(request.getIsActive() != null ? request.getIsActive() : voucher.getIsActive());
            // Không kiểm tra các trường khác, chỉ cần cập nhật isActive
        } else {
            // Nếu chưa được sử dụng, cập nhật toàn bộ thông tin
            TheaterBrand theaterBrand = null;
            if (request.getTheaterBrandId() != null && !voucher.getTheaterBrand().getTheaterBrandId().equals(request.getTheaterBrandId())) {
                theaterBrand = theaterBrandRepository.findById(request.getTheaterBrandId())
                        .orElseThrow(() -> new RuntimeException("TheaterBrand not found with id: " + request.getTheaterBrandId()));
            } else {
                theaterBrand = voucher.getTheaterBrand();
            }

            voucher.setDiscount(request.getDiscount() != null ? request.getDiscount() : voucher.getDiscount());
            voucher.setValidFrom(request.getValidFrom() != null ? request.getValidFrom() : voucher.getValidFrom());
            voucher.setValidUntil(request.getValidUntil() != null ? request.getValidUntil() : voucher.getValidUntil());
            voucher.setMinBillPrice(request.getMinBillPrice() != null ? request.getMinBillPrice() : voucher.getMinBillPrice());
            voucher.setDescription(request.getDescription() != null ? request.getDescription() : voucher.getDescription());
            voucher.setTheaterBrand(theaterBrand);
            voucher.setIsActive(request.getIsActive() != null ? request.getIsActive() : voucher.getIsActive());
        }

        Voucher updatedVoucher = voucherRepository.save(voucher);
        return voucherMapper.toVoucherResponse(updatedVoucher);
    }

    @Override
    public VoucherResponse getVoucherById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
        return voucherMapper.toVoucherResponse(voucher);
    }

    @Override
    public List<VoucherResponse> getAllVouchers() {
        return voucherRepository.findAll().stream()
                .map(voucherMapper::toVoucherResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VoucherResponse> getVoucherByBrand(Integer theaterBrandId) {
        theaterBrandRepository.findById(theaterBrandId)
                .orElseThrow(() -> new RuntimeException("TheaterBrand not found with id: " + theaterBrandId));

        List<Voucher> vouchers = voucherRepository.findByTheaterBrandId(theaterBrandId);
        return vouchers.stream()
                .map(voucherMapper::toVoucherResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean getVoucherIsUsed(Integer id) {
        return voucherUserRepository.existsByVoucherIdAndIsUsed(id, true);
    }
}