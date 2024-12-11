package com.prj.projectweb.configuration;

import java.util.*;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.prj.projectweb.entities.Role;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.repositories.RoleRepository;
import com.prj.projectweb.repositories.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_EMAIL = "admin@gmail.com";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        log.info("Initializing application.....");

        return args -> {
            // Kiểm tra xem người dùng admin đã tồn tại chưa
            if (userRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {
                createRoleIfNotExists(roleRepository);
               
                Role chuCongTyRole = roleRepository.findByRoleName("ChuCongTy");
                if (chuCongTyRole == null) {
                    throw new AppException(ErrorCode.ROLE_NOTFOUND); 
                }

                var adminRoles = new HashSet<Role>();
                adminRoles.add(chuCongTyRole); 

                User user = User.builder()
                        .username(ADMIN_EMAIL)
                        .email(ADMIN_EMAIL)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .role(chuCongTyRole) // Gán vai trò admin
                        .build();

                userRepository.save(user);
                log.warn("Admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");

        };
    }

    private void createRoleIfNotExists(RoleRepository roleRepository) {
        // Kiểm tra và tạo các vai trò
        if (!roleRepository.existsByRoleName("HocVien")) {
            roleRepository.save(Role.builder().roleName("HocVien").build());
        }
        if (!roleRepository.existsByRoleName("PhuHuynh")) {
            roleRepository.save(Role.builder().roleName("PhuHuynh").build());
        }
        if (!roleRepository.existsByRoleName("GiaoVien")) {
            roleRepository.save(Role.builder().roleName("GiaoVien").build());
        }
        if (!roleRepository.existsByRoleName("KeToan")) {
            roleRepository.save(Role.builder().roleName("KeToan").build());
        }
        if (!roleRepository.existsByRoleName("NhanVienTuyenSinh")) {
            roleRepository.save(Role.builder().roleName("NhanVienTuyenSinh").build());
        }
        if (!roleRepository.existsByRoleName("NhanVienHoTroHocVu")) {
            roleRepository.save(Role.builder().roleName("NhanVienHoTroHocVu").build());
        }
        if (!roleRepository.existsByRoleName("BanLanhDao")) {
            roleRepository.save(Role.builder().roleName("BanLanhDao").build());
        }
        if (!roleRepository.existsByRoleName("BanDieuHanh")) {
            roleRepository.save(Role.builder().roleName("BanDieuHanh").build());
        }
        if (!roleRepository.existsByRoleName("BanDieuHanhHeThong")) {
            roleRepository.save(Role.builder().roleName("BanDieuHanhHeThong").build());
        }
        if (!roleRepository.existsByRoleName("ChuCongTy")) {
            roleRepository.save(Role.builder().roleName("ChuCongTy").build());
        }
    }
}
