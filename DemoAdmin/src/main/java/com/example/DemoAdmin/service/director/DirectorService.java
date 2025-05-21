package com.example.DemoAdmin.service.director;

import com.example.DemoAdmin.entity.Director;
import com.example.DemoAdmin.repository.IDirectorRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DirectorService implements IDirectorService {

    private final IDirectorRepository directorRepository;

    public DirectorService(IDirectorRepository directorRepository) {
        this.directorRepository = directorRepository;
    }

    @Override
    public List<Director> getAllDirectors() {
        return directorRepository.findAll();
    }
}
