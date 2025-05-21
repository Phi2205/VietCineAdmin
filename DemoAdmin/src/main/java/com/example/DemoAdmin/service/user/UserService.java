package com.example.DemoAdmin.service.user;

import com.example.DemoAdmin.dto.request.UpdateUserRequest;
import com.example.DemoAdmin.dto.response.UserDTO;
import com.example.DemoAdmin.entity.User;
import com.example.DemoAdmin.repository.IUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(IUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDTO getUserById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return convertToUserDTO(user);
    }

    @Override
    public UserDTO register(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + userDTO.getEmail());
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        user.setFullName(userDTO.getFullName());
        user.setPhone(userDTO.getPhone());
        user.setCreatedAt(LocalDateTime.now());
        user.setAddress(userDTO.getAddress());
        user.setAvatar(userDTO.getAvatar());
        user.setRole(userDTO.getRole());
        user.setProviderId(userDTO.getProviderId());
        user.setUid(userDTO.getUid());
        user.setIdToken(userDTO.getIdToken());

        user = userRepository.save(user);
        UserDTO responseDTO = convertToUserDTO(user);
        responseDTO.setPassword(null); // Don't return password in response
        return responseDTO;
    }

    @Override
    public List<UserDTO> getAllUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<UserDTO> getAllUsersByRolePaginated(String role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAllByRole(role, pageable);
        return users.map(this::convertToUserDTO);
    }

    @Override
    public UserDTO updateUser(Integer userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        User updatedUser = userRepository.save(user);
        return convertToUserDTO(updatedUser);
    }

    @Override
    public void deleteUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setAvatar(user.getAvatar());
        dto.setRole(user.getRole());
        dto.setProviderId(user.getProviderId());
        dto.setUid(user.getUid());
        dto.setIdToken(user.getIdToken());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}