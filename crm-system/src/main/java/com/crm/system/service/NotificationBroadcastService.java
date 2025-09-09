package com.crm.system.service;

import com.crm.system.dto.NotificationDto;
import com.crm.system.model.Notification;
import com.crm.system.model.Notification.RecipientType;
import com.crm.system.model.Notification.NotificationType;
import com.crm.system.model.Notification.NotificationStatus;
import com.crm.system.model.User;
import com.crm.system.model.Student;
import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.Lesson;
import com.crm.system.repository.NotificationRepository;
import com.crm.system.repository.UserRepository;
import com.crm.system.repository.StudentRepository;
import com.crm.system.repository.AvailabilitySlotRepository;
import com.crm.system.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class NotificationBroadcastService {

    private static final Logger logger = Logger.getLogger(NotificationBroadcastService.class.getName());

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TelegramNotificationService telegramNotificationService;