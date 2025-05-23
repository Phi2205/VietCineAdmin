package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.request.VoucherRequest;
import com.example.DemoAdmin.dto.response.VoucherResponse;
import com.example.DemoAdmin.entity.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IVoucherMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "discount", source = "discount")
    @Mapping(target = "validFrom", source = "validFrom")
    @Mapping(target = "validUntil", source = "validUntil")
    @Mapping(target = "minBillPrice", source = "minBillPrice")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "isActive", source = "isActive") // Thêm ánh xạ cho isActive
    @Mapping(target = "theaterBrandId", source = "theaterBrand.theaterBrandId")
    VoucherResponse toVoucherResponse(Voucher voucher);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "theaterBrand", ignore = true)
    @Mapping(target = "voucherUsers", ignore = true)
    Voucher toVoucher(VoucherRequest request);
}