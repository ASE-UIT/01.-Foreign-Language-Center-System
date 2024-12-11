package com.prj.projectweb.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.prj.projectweb.dto.request.IntrospectRequest;
import com.prj.projectweb.dto.request.LoginRequest;
import com.prj.projectweb.dto.request.LogoutRequest;
import com.prj.projectweb.dto.request.RefreshRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.AuthenticationResponse;
import com.prj.projectweb.dto.response.ChildOfParentResponse;
import com.prj.projectweb.dto.response.IntrospectResponse;
import com.prj.projectweb.dto.response.LoginResponse;
import com.prj.projectweb.entities.InvalidatedToken;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.repositories.InvalidatedTokenRepository;
import com.prj.projectweb.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;


    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    public LoginResponse login(LoginRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            throw  new AppException(ErrorCode.EMAIL_WRONG);
        }

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        
        if (!authenticated) {
            throw  new AppException(ErrorCode.PASSWORD_WRONG);
        }

        var token = generateToken(user);

        String role = user.getRole().getRoleName();
        List<ChildOfParentResponse> child = null;

        if ("PhuHuynh".equals(role)) {
            List<User> listUser = userRepository.findAllByParentId(user.getUserId());
            child = listUser.stream()
                    .map(child1 -> ChildOfParentResponse.builder()
                            .id(child1.getUserId())
                            .name(child1.getFullName())
                            .build())
                    .collect(Collectors.toList());
        }


        return LoginResponse.builder()
                .token(token)
                .authenticated(authenticated)
                .role(role)
                .child(child)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var jwtToken = verifyToken(request.getToken(), true);

            var id = jwtToken.getJWTClaimsSet().getJWTID();
            var expiryTime = jwtToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(id).expiredTime(expiryTime).build();

            invalidatedTokenRepository.save(invalidatedToken);

        } catch (AppException e) {
            log.info("Token already expired");
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var jwtToken = verifyToken(request.getToken(), true);

        var id = jwtToken.getJWTClaimsSet().getJWTID();
        var expiryTime = jwtToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(id).expiredTime(expiryTime).build();

        invalidatedTokenRepository.save(invalidatedToken);

        var email = jwtToken.getJWTClaimsSet().getSubject();
        User user = userRepository.findByEmail(email)
                                   .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));
        

        var token = generateToken(user);

        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    private String generateToken(User user) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getEmail())
                    .issuer("CNPMCS")
                    .issueTime(new Date())
                    .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", buildScope(user))
                    .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("ERROR: Cannot create token.", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
    
        if (user.getRole() != null) {
            // Thêm role vào scope
            stringJoiner.add("ROLE_" + user.getRole().getRoleName());
            // Kiểm tra xem role có permissions hay không
            if (!CollectionUtils.isEmpty(user.getRole().getPermissions())) {
                // Thêm tất cả các permission vào scope
                user.getRole().getPermissions().forEach(permission -> {
                    stringJoiner.add(permission.getName());
                });
            }
        }
    
        return stringJoiner.toString();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                        .getJWTClaimsSet()
                        .getIssueTime()
                        .toInstant()
                        .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
    
}
