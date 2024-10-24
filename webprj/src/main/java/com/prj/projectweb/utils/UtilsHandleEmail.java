package com.prj.projectweb.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class UtilsHandleEmail {
    @Autowired
    private JavaMailSender javaMailSender; 
    @Value("${spring.mail.username}")
    private String sender; 

    private String recipient;
    private String msgBody;
    private String subject;

        public void sendHtmlEmail() {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(sender);
            helper.setTo(this.recipient);
            helper.setSubject(this.subject);
            helper.setText(this.msgBody, true); // 'true' indicates that this is an HTML email.

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            log.error("Error sending email: {}", e.getMessage());
            throw new AppException(ErrorCode.SEND_EMAIL_FAILED);
        }
    }

    public String createBody(String username, String message) {
        return "<html>" +
                "<head>" +
                "<!-- Fonts -->" +
                "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">" +
                "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>" +
                "<link href=\"https://fonts.googleapis.com/css2?family=Itim&display=swap\" rel=\"stylesheet\">" +
                "<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap\" rel=\"stylesheet\">" +
                "<style>" +
                "body {" +
                "font-family: \"Inter\", sans-serif;" +
                "margin: 0;" +
                "padding: 0;" +
                "box-sizing: border-box;" +
                "}" +
                ".container {" +
                "padding: 20px;" +
                "box-shadow: 2px 2px 12px gray;" +
                "width: fit-content;" +
                "}" +
                ".greeting {" +
                "font-weight: 600;" +
                "font-style: italic;" +
                "}" +
                ".account-info {" +
                "font-weight: 600;" +
                "}" +
                ".footer {" +
                "font-style: italic;" +
                "color: red;" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<p class=\"greeting\">XIN CHÀO BẠN, EMAIL ĐƯỢC GỬI TỪ CHUỖI TRUNG TÂM NGOẠI NGỮ</p>" +
                "<ul style=\"list-style-type: none; padding-left: 20px;\">" +
                "<li>Tài khoản: <span class=\"account-info\">" + username + "</span></li>" + 
                "<p>" + message + "</p>" +
                "</ul>" +
                "<p class=\"footer\">Email này được tạo tự động - vui lòng không trả lời! Cám ơn.</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    

    public void sendPayment(String email, String subject, String password) {
        log.info("send payment");
        this.recipient = email;
        this.subject = subject;
        this.msgBody = createBody(email, password);
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(sender);
            helper.setTo(this.recipient);
            helper.setSubject(this.subject);
            helper.setText(this.msgBody, true); // 'true' indicates that this is an HTML email.

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new AppException(ErrorCode.SEND_EMAIL_FAILED);
        }
    }


}
