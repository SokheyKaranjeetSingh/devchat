package com.devchat.backend.service;

import com.devchat.backend.entity.User;
import com.devchat.backend.enums.Role;
import com.devchat.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${superadmin.email}")
    private String superadminEmail;

    @Value("${superadmin.password}")
    private String superadminPassword;

    @Override
    public void run(String... args) throws Exception {
        // Create superadmin if doesn't exist
        if (userRepository.findByUsername("superadmin").isEmpty()) {
            User superadmin = new User();
            superadmin.setUsername("superadmin");
            superadmin.setEmail(superadminEmail);
            superadmin.setPassword(passwordEncoder.encode(superadminPassword));
            superadmin.setRole(Role.SUPERADMIN);
            superadmin.setVerified(true);
            userRepository.save(superadmin);
        }
    }
}