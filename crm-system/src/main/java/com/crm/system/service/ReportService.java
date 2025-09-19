package com.crm.system.service;

import com.crm.system.dto.ExportReportDto;
import com.crm.system.model.Lesson;
import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.repository.LessonPackageRepository;
import com.crm.system.repository.LessonRepository;
import com.crm.system.repository.StudentRepository;
import com.crm.system.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LessonPackageRepository lessonPackageRepository;

    public ExportReportDto generateStudentsReport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<Student> students = studentRepository.findAll();
        byte[] excelData = generateStudentsExcel(students);
        
        String fileName = "students_report_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        
        return new ExportReportDto("STUDENTS", "XLSX", startDate, endDate, fileName, excelData);
    }

    public ExportReportDto generateTeachersReport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<User> teachers = userRepository.findByRole(com.crm.system.model.UserRole.TEACHER);
        byte[] excelData = generateTeachersExcel(teachers);
        
        String fileName = "teachers_report_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        
        return new ExportReportDto("TEACHERS", "XLSX", startDate, endDate, fileName, excelData);
    }

    public ExportReportDto generateLessonsReport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        LocalDate start = startDate != null ? startDate.toLocalDate() : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate.toLocalDate() : LocalDate.now();
        
        List<Lesson> lessons = lessonRepository.findByDateRange(start, end);
        byte[] excelData = generateLessonsExcel(lessons);
        
        String fileName = "lessons_report_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        
        return new ExportReportDto("LESSONS", "XLSX", startDate, endDate, fileName, excelData);
    }

    // Extended reports for admin
    public ExportReportDto generatePackagesReport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<LessonPackage> packages = lessonPackageRepository.findAll();
        byte[] excelData = generatePackagesExcel(packages);
        
        String fileName = "packages_report_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        
        return new ExportReportDto("PACKAGES", "XLSX", startDate, endDate, fileName, excelData);
    }

    public ExportReportDto generateSystemStatsReport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        // Generate system statistics report
        byte[] excelData = generateSystemStatsExcel();
        
        String fileName = "system_stats_report_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        
        return new ExportReportDto("SYSTEM_STATS", "XLSX", startDate, endDate, fileName, excelData);
    }

    public ExportReportDto generateTeacherPerformanceReport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<User> teachers = userRepository.findByRole(com.crm.system.model.UserRole.TEACHER);
        byte[] excelData = generateTeacherPerformanceExcel(teachers);
        
        String fileName = "teacher_performance_report_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        
        return new ExportReportDto("TEACHER_PERFORMANCE", "XLSX", startDate, endDate, fileName, excelData);
    }

    public ExportReportDto generateStudentProgressReport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<Student> students = studentRepository.findAll();
        byte[] excelData = generateStudentProgressExcel(students);
        
        String fileName = "student_progress_report_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        
        return new ExportReportDto("STUDENT_PROGRESS", "XLSX", startDate, endDate, fileName, excelData);
    }

    // Mass export functionality for admin
    public ExportReportDto generateMassExportReport(String exportType, LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        switch (exportType.toLowerCase()) {
            case "all_data":
                return generateAllDataExport(startDate, endDate);
            case "users_only":
                return generateUsersOnlyExport(startDate, endDate);
            case "lessons_and_packages":
                return generateLessonsAndPackagesExport(startDate, endDate);
            default:
                throw new IllegalArgumentException("Unsupported export type: " + exportType);
        }
    }

    private ExportReportDto generateAllDataExport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        // Create a workbook with multiple sheets
        Workbook workbook = new XSSFWorkbook();
        
        // Students sheet
        Sheet studentsSheet = workbook.createSheet("Students");
        List<Student> students = studentRepository.findAll();
        createStudentsSheet(studentsSheet, students);
        
        // Teachers sheet
        Sheet teachersSheet = workbook.createSheet("Teachers");
        List<User> teachers = userRepository.findByRole(com.crm.system.model.UserRole.TEACHER);
        createTeachersSheet(teachersSheet, teachers);
        
        // Managers sheet
        Sheet managersSheet = workbook.createSheet("Managers");
        List<User> managers = userRepository.findByRole(com.crm.system.model.UserRole.MANAGER);
        createManagersSheet(managersSheet, managers);
        
        // Lessons sheet
        Sheet lessonsSheet = workbook.createSheet("Lessons");
        LocalDate start = startDate != null ? startDate.toLocalDate() : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate.toLocalDate() : LocalDate.now();
        List<Lesson> lessons = lessonRepository.findByDateRange(start, end);
        createLessonsSheet(lessonsSheet, lessons);
        
        // Packages sheet
        Sheet packagesSheet = workbook.createSheet("Packages");
        List<LessonPackage> packages = lessonPackageRepository.findAll();
        createPackagesSheet(packagesSheet, packages);
        
        // System stats sheet
        Sheet statsSheet = workbook.createSheet("System Stats");
        createSystemStatsSheet(statsSheet);
        
        // Auto-size columns for all sheets
        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet sheet = workbook.getSheetAt(i);
            Row headerRow = sheet.getRow(0);
            if (headerRow != null) {
                for (int j = 0; j < headerRow.getLastCellNum(); j++) {
                    sheet.autoSizeColumn(j);
                }
            }
        }
        
        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        String fileName = "mass_export_all_data_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        return new ExportReportDto("ALL_DATA", "XLSX", startDate, endDate, fileName, outputStream.toByteArray());
    }

    private ExportReportDto generateUsersOnlyExport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        // Create a workbook with user-related sheets
        Workbook workbook = new XSSFWorkbook();
        
        // Students sheet
        Sheet studentsSheet = workbook.createSheet("Students");
        List<Student> students = studentRepository.findAll();
        createStudentsSheet(studentsSheet, students);
        
        // Teachers sheet
        Sheet teachersSheet = workbook.createSheet("Teachers");
        List<User> teachers = userRepository.findByRole(com.crm.system.model.UserRole.TEACHER);
        createTeachersSheet(teachersSheet, teachers);
        
        // Managers sheet
        Sheet managersSheet = workbook.createSheet("Managers");
        List<User> managers = userRepository.findByRole(com.crm.system.model.UserRole.MANAGER);
        createManagersSheet(managersSheet, managers);
        
        // Auto-size columns for all sheets
        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet sheet = workbook.getSheetAt(i);
            Row headerRow = sheet.getRow(0);
            if (headerRow != null) {
                for (int j = 0; j < headerRow.getLastCellNum(); j++) {
                    sheet.autoSizeColumn(j);
                }
            }
        }
        
        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        String fileName = "mass_export_users_only_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        return new ExportReportDto("USERS_ONLY", "XLSX", startDate, endDate, fileName, outputStream.toByteArray());
    }

    private ExportReportDto generateLessonsAndPackagesExport(LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        // Create a workbook with lessons and packages sheets
        Workbook workbook = new XSSFWorkbook();
        
        // Lessons sheet
        Sheet lessonsSheet = workbook.createSheet("Lessons");
        LocalDate start = startDate != null ? startDate.toLocalDate() : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate.toLocalDate() : LocalDate.now();
        List<Lesson> lessons = lessonRepository.findByDateRange(start, end);
        createLessonsSheet(lessonsSheet, lessons);
        
        // Packages sheet
        Sheet packagesSheet = workbook.createSheet("Packages");
        List<LessonPackage> packages = lessonPackageRepository.findAll();
        createPackagesSheet(packagesSheet, packages);
        
        // Auto-size columns for all sheets
        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet sheet = workbook.getSheetAt(i);
            Row headerRow = sheet.getRow(0);
            if (headerRow != null) {
                for (int j = 0; j < headerRow.getLastCellNum(); j++) {
                    sheet.autoSizeColumn(j);
                }
            }
        }
        
        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        String fileName = "mass_export_lessons_packages_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
        return new ExportReportDto("LESSONS_PACKAGES", "XLSX", startDate, endDate, fileName, outputStream.toByteArray());
    }

    private void createStudentsSheet(Sheet sheet, List<Student> students) {
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "First Name", "Last Name", "Email", "Phone", "Telegram", "Date of Birth", "Assigned Teacher", "Created At"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
            Font font = sheet.getWorkbook().createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (Student student : students) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(student.getId());
            row.createCell(1).setCellValue(student.getFirstName());
            row.createCell(2).setCellValue(student.getLastName());
            row.createCell(3).setCellValue(student.getEmail() != null ? student.getEmail() : "");
            row.createCell(4).setCellValue(student.getPhone() != null ? student.getPhone() : "");
            row.createCell(5).setCellValue(student.getTelegramUsername() != null ? student.getTelegramUsername() : "");
            row.createCell(6).setCellValue(student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : "");
            row.createCell(7).setCellValue(student.getAssignedTeacher() != null ? 
                student.getAssignedTeacher().getFirstName() + " " + student.getAssignedTeacher().getLastName() : "Not assigned");
            row.createCell(8).setCellValue(student.getCreatedAt() != null ? student.getCreatedAt().toString() : "");
        }
    }

    private void createTeachersSheet(Sheet sheet, List<User> teachers) {
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "First Name", "Last Name", "Email", "Phone", "Telegram", "Specialization", "Active", "Created At"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
            Font font = sheet.getWorkbook().createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (User teacher : teachers) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(teacher.getId());
            row.createCell(1).setCellValue(teacher.getFirstName());
            row.createCell(2).setCellValue(teacher.getLastName());
            row.createCell(3).setCellValue(teacher.getEmail());
            row.createCell(4).setCellValue(teacher.getPhone() != null ? teacher.getPhone() : "");
            row.createCell(5).setCellValue(teacher.getTelegramUsername() != null ? teacher.getTelegramUsername() : "");
            row.createCell(6).setCellValue(""); // Specialization field - could be added to User model
            row.createCell(7).setCellValue(teacher.getIsActive() ? "Yes" : "No");
            row.createCell(8).setCellValue(teacher.getCreatedAt() != null ? teacher.getCreatedAt().toString() : "");
        }
    }

    private void createManagersSheet(Sheet sheet, List<User> managers) {
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "First Name", "Last Name", "Email", "Phone", "Telegram", "Active", "Created At"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
            Font font = sheet.getWorkbook().createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (User manager : managers) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(manager.getId());
            row.createCell(1).setCellValue(manager.getFirstName());
            row.createCell(2).setCellValue(manager.getLastName());
            row.createCell(3).setCellValue(manager.getEmail());
            row.createCell(4).setCellValue(manager.getPhone() != null ? manager.getPhone() : "");
            row.createCell(5).setCellValue(manager.getTelegramUsername() != null ? manager.getTelegramUsername() : "");
            row.createCell(6).setCellValue(manager.getIsActive() ? "Yes" : "No");
            row.createCell(7).setCellValue(manager.getCreatedAt() != null ? manager.getCreatedAt().toString() : "");
        }
    }

    private void createLessonsSheet(Sheet sheet, List<Lesson> lessons) {
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Student", "Teacher", "Date", "Time", "Duration (min)", "Status", "Cancelled By", "Notes", "Created At"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
            Font font = sheet.getWorkbook().createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (Lesson lesson : lessons) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(lesson.getId());
            row.createCell(1).setCellValue(lesson.getStudent() != null ? 
                lesson.getStudent().getFirstName() + " " + lesson.getStudent().getLastName() : "");
            row.createCell(2).setCellValue(lesson.getTeacher() != null ? 
                lesson.getTeacher().getFirstName() + " " + lesson.getTeacher().getLastName() : "");
            row.createCell(3).setCellValue(lesson.getScheduledDate() != null ? lesson.getScheduledDate().toString() : "");
            row.createCell(4).setCellValue(lesson.getScheduledTime() != null ? lesson.getScheduledTime().toString() : "");
            row.createCell(5).setCellValue(lesson.getDurationMinutes());
            row.createCell(6).setCellValue(lesson.getStatus() != null ? lesson.getStatus().name() : "");
            row.createCell(7).setCellValue(lesson.getCancelledBy() != null ? lesson.getCancelledBy().name() : "");
            row.createCell(8).setCellValue(lesson.getNotes() != null ? lesson.getNotes() : "");
            row.createCell(9).setCellValue(lesson.getCreatedAt() != null ? lesson.getCreatedAt().toString() : "");
        }
    }

    private void createPackagesSheet(Sheet sheet, List<LessonPackage> packages) {
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Student", "Total Lessons", "Remaining Lessons", "Created At", "Status"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
            Font font = sheet.getWorkbook().createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (LessonPackage pkg : packages) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(pkg.getId());
            row.createCell(1).setCellValue(pkg.getStudent() != null ? 
                pkg.getStudent().getFirstName() + " " + pkg.getStudent().getLastName() : "");
            row.createCell(2).setCellValue(pkg.getTotalLessons());
            row.createCell(3).setCellValue(pkg.getRemainingLessons());
            
            String status = "Active";
            if (pkg.getRemainingLessons() <= 0) {
                status = "Completed";
            } else if (pkg.getCreatedAt().isBefore(LocalDateTime.now().minusMonths(3))) {
                status = "Expired";
            }
            
            row.createCell(4).setCellValue(pkg.getCreatedAt() != null ? pkg.getCreatedAt().toString() : "");
            row.createCell(5).setCellValue(status);
        }
    }

    private void createSystemStatsSheet(Sheet sheet) {
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Metric", "Value"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
            Font font = sheet.getWorkbook().createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows - placeholder data for now
        int rowNum = 1;
        Row row1 = sheet.createRow(rowNum++);
        row1.createCell(0).setCellValue("Total Students");
        row1.createCell(1).setCellValue(studentRepository.count());

        Row row2 = sheet.createRow(rowNum++);
        row2.createCell(0).setCellValue("Total Teachers");
        row2.createCell(1).setCellValue(userRepository.countByRole(com.crm.system.model.UserRole.TEACHER));

        Row row3 = sheet.createRow(rowNum++);
        row3.createCell(0).setCellValue("Total Managers");
        row3.createCell(1).setCellValue(userRepository.countByRole(com.crm.system.model.UserRole.MANAGER));

        Row row4 = sheet.createRow(rowNum++);
        row4.createCell(0).setCellValue("Total Lessons");
        row4.createCell(1).setCellValue(lessonRepository.count());

        Row row5 = sheet.createRow(rowNum++);
        row5.createCell(0).setCellValue("Active Lesson Packages");
        row5.createCell(1).setCellValue(lessonPackageRepository.countByRemainingLessonsGreaterThan(0));
    }

    private byte[] generateStudentsExcel(List<Student> students) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Students");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "First Name", "Last Name", "Email", "Phone", "Telegram", "Date of Birth", "Assigned Teacher", "Created At"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (Student student : students) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(student.getId());
            row.createCell(1).setCellValue(student.getFirstName());
            row.createCell(2).setCellValue(student.getLastName());
            row.createCell(3).setCellValue(student.getEmail() != null ? student.getEmail() : "");
            row.createCell(4).setCellValue(student.getPhone() != null ? student.getPhone() : "");
            row.createCell(5).setCellValue(student.getTelegramUsername() != null ? student.getTelegramUsername() : "");
            row.createCell(6).setCellValue(student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : "");
            row.createCell(7).setCellValue(student.getAssignedTeacher() != null ? 
                student.getAssignedTeacher().getFirstName() + " " + student.getAssignedTeacher().getLastName() : "Not assigned");
            row.createCell(8).setCellValue(student.getCreatedAt() != null ? student.getCreatedAt().toString() : "");
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    private byte[] generateTeachersExcel(List<User> teachers) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Teachers");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "First Name", "Last Name", "Email", "Phone", "Telegram", "Specialization", "Active", "Created At"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (User teacher : teachers) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(teacher.getId());
            row.createCell(1).setCellValue(teacher.getFirstName());
            row.createCell(2).setCellValue(teacher.getLastName());
            row.createCell(3).setCellValue(teacher.getEmail());
            row.createCell(4).setCellValue(teacher.getPhone() != null ? teacher.getPhone() : "");
            row.createCell(5).setCellValue(teacher.getTelegramUsername() != null ? teacher.getTelegramUsername() : "");
            row.createCell(6).setCellValue(""); // Specialization field - could be added to User model
            row.createCell(7).setCellValue(teacher.getIsActive() ? "Yes" : "No");
            row.createCell(8).setCellValue(teacher.getCreatedAt() != null ? teacher.getCreatedAt().toString() : "");
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    private byte[] generateLessonsExcel(List<Lesson> lessons) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Lessons");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Student", "Teacher", "Date", "Time", "Duration (min)", "Status", "Cancelled By", "Notes", "Created At"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (Lesson lesson : lessons) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(lesson.getId());
            row.createCell(1).setCellValue(lesson.getStudent() != null ? 
                lesson.getStudent().getFirstName() + " " + lesson.getStudent().getLastName() : "");
            row.createCell(2).setCellValue(lesson.getTeacher() != null ? 
                lesson.getTeacher().getFirstName() + " " + lesson.getTeacher().getLastName() : "");
            row.createCell(3).setCellValue(lesson.getScheduledDate() != null ? lesson.getScheduledDate().toString() : "");
            row.createCell(4).setCellValue(lesson.getScheduledTime() != null ? lesson.getScheduledTime().toString() : "");
            row.createCell(5).setCellValue(lesson.getDurationMinutes());
            row.createCell(6).setCellValue(lesson.getStatus() != null ? lesson.getStatus().name() : "");
            row.createCell(7).setCellValue(lesson.getCancelledBy() != null ? lesson.getCancelledBy().name() : "");
            row.createCell(8).setCellValue(lesson.getNotes() != null ? lesson.getNotes() : "");
            row.createCell(9).setCellValue(lesson.getCreatedAt() != null ? lesson.getCreatedAt().toString() : "");
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    // Extended Excel generation methods for admin
    private byte[] generatePackagesExcel(List<LessonPackage> packages) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Lesson Packages");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Student", "Total Lessons", "Remaining Lessons", "Created At", "Status"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        int rowNum = 1;
        for (LessonPackage pkg : packages) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(pkg.getId());
            row.createCell(1).setCellValue(pkg.getStudent() != null ? 
                pkg.getStudent().getFirstName() + " " + pkg.getStudent().getLastName() : "");
            row.createCell(2).setCellValue(pkg.getTotalLessons());
            row.createCell(3).setCellValue(pkg.getRemainingLessons());
            
            String status = "Active";
            if (pkg.getRemainingLessons() <= 0) {
                status = "Completed";
            } else if (pkg.getCreatedAt().isBefore(LocalDateTime.now().minusMonths(3))) {
                status = "Expired";
            }
            
            row.createCell(4).setCellValue(pkg.getCreatedAt() != null ? pkg.getCreatedAt().toString() : "");
            row.createCell(5).setCellValue(status);
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    private byte[] generateSystemStatsExcel() throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("System Statistics");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Metric", "Value"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows - placeholder data for now
        int rowNum = 1;
        Row row1 = sheet.createRow(rowNum++);
        row1.createCell(0).setCellValue("Total Students");
        row1.createCell(1).setCellValue(studentRepository.count());

        Row row2 = sheet.createRow(rowNum++);
        row2.createCell(0).setCellValue("Total Teachers");
        row2.createCell(1).setCellValue(userRepository.countByRole(com.crm.system.model.UserRole.TEACHER));

        Row row3 = sheet.createRow(rowNum++);
        row3.createCell(0).setCellValue("Total Managers");
        row3.createCell(1).setCellValue(userRepository.countByRole(com.crm.system.model.UserRole.MANAGER));

        Row row4 = sheet.createRow(rowNum++);
        row4.createCell(0).setCellValue("Total Lessons");
        row4.createCell(1).setCellValue(lessonRepository.count());

        Row row5 = sheet.createRow(rowNum++);
        row5.createCell(0).setCellValue("Active Lesson Packages");
        row5.createCell(1).setCellValue(lessonPackageRepository.countByRemainingLessonsGreaterThan(0));

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    private byte[] generateTeacherPerformanceExcel(List<User> teachers) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Teacher Performance");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Teacher ID", "Name", "Total Lessons", "Completed Lessons", "Cancelled Lessons", "Average Rating"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows - placeholder data for now
        int rowNum = 1;
        for (User teacher : teachers) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(teacher.getId());
            row.createCell(1).setCellValue(teacher.getFirstName() + " " + teacher.getLastName());
            row.createCell(2).setCellValue(0); // Total lessons - would need to query
            row.createCell(3).setCellValue(0); // Completed lessons - would need to query
            row.createCell(4).setCellValue(0); // Cancelled lessons - would need to query
            row.createCell(5).setCellValue(0.0); // Average rating - would need to query
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    private byte[] generateStudentProgressExcel(List<Student> students) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Student Progress");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Student ID", "Name", "Email", "Assigned Teacher", "Total Packages", "Remaining Lessons", "Last Lesson Date"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows - placeholder data for now
        int rowNum = 1;
        for (Student student : students) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(student.getId());
            row.createCell(1).setCellValue(student.getFirstName() + " " + student.getLastName());
            row.createCell(2).setCellValue(student.getEmail() != null ? student.getEmail() : "");
            
            String teacherName = "Not assigned";
            if (student.getAssignedTeacher() != null) {
                teacherName = student.getAssignedTeacher().getFirstName() + " " + student.getAssignedTeacher().getLastName();
            }
            row.createCell(3).setCellValue(teacherName);
            
            row.createCell(4).setCellValue(0); // Total packages - would need to query
            row.createCell(5).setCellValue(0); // Remaining lessons - would need to query
            row.createCell(6).setCellValue(""); // Last lesson date - would need to query
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }
}