package com.prj.projectweb.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException; // Kiểm tra import này


@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // Constructor injection để nhận JavaMailSender từ Spring
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) throws MessagingException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to); // Địa chỉ email người nhận
        message.setSubject(subject); // Tiêu đề email
        message.setText(text); // Nội dung email

        mailSender.send(message); // Gửi email
    }
}
