package com.crm.system.service;

import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailGatewayService emailGatewayService;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findByTelegramChatId(Long chatId) {
        return userRepository.findByTelegramChatId(chatId);
    }

    public boolean isUserRegisteredWithTelegram(Long chatId) {
        return userRepository.existsByTelegramChatId(chatId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User createUser(String firstName, String lastName, String email, String password, UserRole role) {
        User user = new User(firstName, lastName, email, passwordEncoder.encode(password), role);
        User savedUser = userRepository.save(user);
        try {
            emailGatewayService.sendWelcomeEmail(savedUser, password);
        } catch (Exception ex) {
            // Ошибка отправки письма не должна блокировать создание пользователя
        }
        return savedUser;
    }

    public List<User> findByRole(UserRole role) {
        return userRepository.findByRoleAndIsActive(role, true);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getById(Long id) {
        return findById(id).orElseThrow(() -> new com.crm.system.exception.UserNotFoundException(id));
    }
}

