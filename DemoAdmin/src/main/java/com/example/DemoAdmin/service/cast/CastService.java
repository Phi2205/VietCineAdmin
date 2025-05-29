package com.example.DemoAdmin.service.cast;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.DemoAdmin.dto.response.CastResponse;
import com.example.DemoAdmin.entity.Cast;
import com.example.DemoAdmin.mapper.ICastMapper;
import com.example.DemoAdmin.repository.ICastRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CastService implements ICastService {

    private final ICastRepository castRepository;
    private final ICastMapper castMapper;
    private final Cloudinary cloudinary;

    @Override
    public CastResponse createCast(String name, MultipartFile avatar) throws IOException {
        Cast cast = new Cast();
        cast.setName(name);
        if (avatar != null && !avatar.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(avatar.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "avatar_cast_" + name,
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String avatarUrl = (String) uploadResult.get("secure_url");
            cast.setAvatar(avatarUrl);
        }
        Cast savedCast = castRepository.save(cast);
        return castMapper.toCastResponse(savedCast);
    }

    @Override
    public CastResponse updateCast(Integer id, String name, MultipartFile avatar) throws IOException {
        Cast cast = castRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Cast với id: " + id));

        cast.setName(name != null ? name : cast.getName());
        if (avatar != null && !avatar.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(avatar.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "avatar_cast_" + name,
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String avatarUrl = (String) uploadResult.get("secure_url");
            cast.setAvatar(avatarUrl);
        }

        Cast updatedCast = castRepository.save(cast);
        return castMapper.toCastResponse(updatedCast);
    }

    @Override
    public CastResponse getCastById(Integer id) {
        Cast cast = castRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Cast với id: " + id));
        return castMapper.toCastResponse(cast);
    }

    @Override
    public List<CastResponse> getAllCasts() {
        return castRepository.findAll().stream()
                .map(castMapper::toCastResponse)
                .collect(Collectors.toList());
    }
}