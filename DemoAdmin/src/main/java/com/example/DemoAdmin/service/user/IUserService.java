package com.example.DemoAdmin.service.user;


import com.example.DemoAdmin.dto.request.UpdateUserRequest;
import com.example.DemoAdmin.dto.response.UserDTO;
import com.example.DemoAdmin.entity.User;
import org.springframework.data.domain.Page;
import java.util.List;

import java.util.Optional;

public interface IUserService {
    Optional<User> findByEmail(String email);
    UserDTO getUserById(Integer userId);
    UserDTO register(UserDTO userDTO);
    List<UserDTO> getAllUsersByRole(String role);
    Page<UserDTO> getAllUsersByRolePaginated(String role, int page, int size);
    UserDTO updateUser(Integer userId, UpdateUserRequest request);
    void deleteUser(Integer userId);
}