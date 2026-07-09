package com.ducthe.backend.security;

import com.ducthe.backend.entity.User;
import com.ducthe.backend.exception.BadRequestException;
import com.ducthe.backend.service.CustomerAuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final CustomerAuthService customerAuthService;
    private final String frontendRedirectUri;

    public OAuth2LoginSuccessHandler(
            CustomerAuthService customerAuthService,
            @Value("${app.oauth2.redirect-uri-frontend:http://localhost:3000/oauth2/success}") String frontendRedirectUri
    ) {
        this.customerAuthService = customerAuthService;
        this.frontendRedirectUri = frontendRedirectUri;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        Boolean emailVerified = oauthUser.getAttribute("email_verified");

        if (email == null || email.isBlank() || Boolean.FALSE.equals(emailVerified)) {
            response.sendRedirect(errorRedirect("Google email has not been verified."));
            return;
        }

        User saved;
        try {
            saved = customerAuthService.findOrCreateGoogleCustomer(email, name);
        } catch (BadRequestException ex) {
            response.sendRedirect(errorRedirect(ex.getMessage()));
            return;
        }

        String token = customerAuthService.authResponse(saved).token();
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                .queryParam("token", token)
                .queryParam("tokenType", "Bearer")
                .queryParam("userId", saved.getId())
                .queryParam("fullName", saved.getFullName())
                .queryParam("email", saved.getEmail())
                .queryParam("role", saved.getRole().name())
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private String errorRedirect(String message) {
        return UriComponentsBuilder.fromUriString(frontendRedirectUri)
                .queryParam("error", message)
                .build()
                .encode()
                .toUriString();
    }
}
