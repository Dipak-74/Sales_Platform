package com.example.Sales_Platform.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Role;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Intities.UserStatus;

public interface UserRepo extends JpaRepository<User, Long>{

	Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);
    List<User> findByRole(Role role);
    List<User> findByCreatedBy_Id(Long createdById);
    
    List<User>findByStatus(UserStatus status);
}
