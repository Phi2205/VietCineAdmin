package com.example.DemoAdmin.service.director;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.DemoAdmin.dto.response.DirectorResponse;
import com.example.DemoAdmin.entity.Director;
import com.example.DemoAdmin.mapper.IDirectorMapper;
import com.example.DemoAdmin.repository.IDirectorRepository;
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
public class DirectorService implements IDirectorService {

    private final IDirectorRepository directorRepository;
    private final IDirectorMapper directorMapper;
    private final Cloudinary cloudinary;

    @Override
    public DirectorResponse createDirector(String name, MultipartFile avatar) throws IOException {
        Director director = new Director();
        director.setName(name);
        if (avatar != null && !avatar.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(avatar.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "avatar_director_" + name,
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String avatarUrl = (String) uploadResult.get("secure_url");
            director.setAvatar(avatarUrl);
        }
        Director savedDirector = directorRepository.save(director);
        return directorMapper.toDirectorResponse(savedDirector);
    }

    @Override
    public DirectorResponse updateDirector(Integer id, String name, MultipartFile avatar) throws IOException {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Director với id: " + id));

        director.setName(name != null ? name : director.getName());
        if (avatar != null && !avatar.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(avatar.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "avatar_director_" + name,
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String avatarUrl = (String) uploadResult.get("secure_url");
            director.setAvatar(avatarUrl);
        }

        Director updatedDirector = directorRepository.save(director);
        return directorMapper.toDirectorResponse(updatedDirector);
    }

    @Override
    public DirectorResponse getDirectorById(Integer id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Director với id: " + id));
        return directorMapper.toDirectorResponse(director);
    }

    @Override
    public List<DirectorResponse> getAllDirectors() {
        return directorRepository.findAll().stream()
                .map(directorMapper::toDirectorResponse)
                .collect(Collectors.toList());
    }
}