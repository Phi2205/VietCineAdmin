package com.example.DemoAdmin.service.seatprice;

import com.example.DemoAdmin.dto.request.SeatPriceRequest;
import com.example.DemoAdmin.dto.request.SeatTypeDTORequest;
import com.example.DemoAdmin.dto.request.SeatTypesRequest;
import com.example.DemoAdmin.dto.response.*;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.SeatPrice;
import com.example.DemoAdmin.entity.Theater;
import com.example.DemoAdmin.mapper.ISeatPriceMapper;
import com.example.DemoAdmin.mapper.ITheaterMapper;
import com.example.DemoAdmin.repository.IScreenRepository;
import com.example.DemoAdmin.repository.ISeatPriceRepository;
import com.example.DemoAdmin.repository.ITheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatPriceService implements ISeatPriceService{
    @Autowired
    private final IScreenRepository screenRepository;
    @Autowired
    private final ISeatPriceRepository seatPriceRepository;
    @Autowired
    private final ISeatPriceMapper seatPriceMapper;
    @Autowired
    private final ITheaterRepository theaterRepository;
    @Autowired
    private final ITheaterMapper theaterMapper;


    @Override
    public SeatPriceResponse addSeatPrice(SeatPriceRequest request) {
        System.out.println(request.getScreenId());
        Screen screen =  screenRepository.findById(request.getScreenId())
                .orElseThrow(()->new RuntimeException("Screen not exist"));
        System.out.println(screen.getScreenNumber());
        SeatPrice seatPrice = new SeatPrice();
        seatPrice.setScreen(screen);
        seatPrice.setSeatTypeId(request.getSeatTypeId());
        seatPrice.setPrice(request.getPrice());
        seatPriceRepository.save(seatPrice);
        return seatPriceMapper.toSeatPriceResponse(seatPrice);
    }


    @Override
    public List<SeatPriceResponse> getAllSeatPrices(){
        return seatPriceRepository.findAll().stream()
                .map(seatPriceMapper::toSeatPriceResponse)
                .collect(Collectors.toList());
    }


    @Override
    public SeatPriceResponse updateSeatPrice(SeatPriceRequest request, Integer id){
        SeatPrice seatPrice = seatPriceRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Seat Price not exist"));
        Screen screen = screenRepository.findById(request.getScreenId())
                        .orElseThrow(()-> new RuntimeException("Screen not exist"));
        seatPrice.setScreen(screen);
        seatPrice.setSeatTypeId(request.getSeatTypeId());
        seatPrice.setPrice(request.getPrice());
        SeatPrice seatPriceSaved = seatPriceRepository.save(seatPrice);
        return seatPriceMapper.toSeatPriceResponse(seatPriceSaved);
    }

    @Override
    public SeatPriceResponse getSeatPriceById(Integer id) {
        SeatPrice seatPrice = seatPriceRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Seat price not exist"));
        System.out.println(seatPrice.getScreen().getId());
        Screen screen = screenRepository.findById(seatPrice.getScreen().getId())
                .orElseThrow(()-> new RuntimeException("Screen not exist"));
        Theater theater = theaterRepository.findById(screen.getTheater().getId())
                        .orElseThrow(()-> new RuntimeException("Theater not exist"));
        screen.setTheater(theater);
        seatPrice.setScreen(screen);
        return seatPriceMapper.toSeatPriceResponse(seatPrice);
    }

    @Override
    public void updateSeatPriceOfScreen(SeatTypesRequest seatTypesRequest, Integer screenId) {
        for (Map.Entry<String, SeatTypeDTORequest> entry : seatTypesRequest.getSeatTypes().entrySet()) {
            String type = entry.getKey();
            SeatTypeDTORequest config = entry.getValue();

            System.out.println("Type: " + type);
            System.out.println("Price: " + config.getPrice());
            System.out.println("Enabled: " + config.isEnabled());
            Integer typeId = 1;
            switch (type){
                case "available":
                    typeId = 1;
                    break;
                case "vip":
                    typeId = 2;
                    break;
                default:
                    typeId = 3;
                    break;
            }
            SeatPrice seatPrice = seatPriceRepository.findByScreenIdAndSeatTypeId(screenId,typeId);
            if (seatPrice != null){

                if (seatPrice.getPrice() == config.getPrice()){
                    continue;
                }
            }
            if (seatPrice == null){
                seatPrice = new SeatPrice();
                seatPrice.setSeatTypeId(typeId);
                seatPrice.setPrice(config.getPrice());
                Screen screen = screenRepository.findById(screenId)
                        .orElseThrow(()-> new RuntimeException("Screen not exist"));
                seatPrice.setScreen(screen);
                seatPriceRepository.save(seatPrice);
            } else {
                seatPrice.setPrice(config.getPrice());
                seatPriceRepository.save(seatPrice);
            }

        }

    }

    @Override
    public SeatTypesResponse getSeatPriceOfScreen(Integer screenId) {

        Map<String, SeatTypeDTOResponse> seatTypes = new HashMap<>();
        SeatPrice seatPrice1 = seatPriceRepository.findByScreenIdAndSeatTypeId(screenId, 1);
        if (seatPrice1 != null){
            SeatTypeDTOResponse seatTypeDTOResponse = new SeatTypeDTOResponse();
            seatTypeDTOResponse.setPrice(seatPrice1.getPrice());
            seatTypeDTOResponse.setEnabled(true);
            seatTypes.put("available",seatTypeDTOResponse);
        } else {
            SeatTypeDTOResponse seatTypeDTOResponse = new SeatTypeDTOResponse();
            seatTypeDTOResponse.setPrice(0);
            seatTypeDTOResponse.setEnabled(false);
            seatTypes.put("available",seatTypeDTOResponse);
        }
        SeatPrice seatPrice2 = seatPriceRepository.findByScreenIdAndSeatTypeId(screenId, 2);
        if (seatPrice2 != null){
            SeatTypeDTOResponse seatTypeDTOResponse = new SeatTypeDTOResponse();
            seatTypeDTOResponse.setPrice(seatPrice2.getPrice());
            seatTypeDTOResponse.setEnabled(true);
            seatTypes.put("vip",seatTypeDTOResponse);
        } else {
            SeatTypeDTOResponse seatTypeDTOResponse = new SeatTypeDTOResponse();
            seatTypeDTOResponse.setPrice(0);
            seatTypeDTOResponse.setEnabled(false);
            seatTypes.put("vip",seatTypeDTOResponse);
        }
        SeatPrice seatPrice3 = seatPriceRepository.findByScreenIdAndSeatTypeId(screenId, 3);
        if (seatPrice3 != null){
            SeatTypeDTOResponse seatTypeDTOResponse = new SeatTypeDTOResponse();
            seatTypeDTOResponse.setPrice(seatPrice3.getPrice());
            seatTypeDTOResponse.setEnabled(true);
            seatTypes.put("couple",seatTypeDTOResponse);
        } else {
            SeatTypeDTOResponse seatTypeDTOResponse = new SeatTypeDTOResponse();
            seatTypeDTOResponse.setPrice(0);
            seatTypeDTOResponse.setEnabled(false);
            seatTypes.put("couple",seatTypeDTOResponse);
        }
        SeatTypesResponse seatTypesResponse = new SeatTypesResponse();
        seatTypesResponse.setSeatTypes(seatTypes);
        return seatTypesResponse;
    }


    @Override
    public void deleteSeatPrice(Integer id) {
        SeatPrice seatPrice = seatPriceRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Seat Price not exist"));
        seatPriceRepository.delete(seatPrice);
    }
}
