package com.ducthe.backend.security;

import com.ducthe.backend.enums.RoleName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

@Service
public class JwtService {
    private final String secret;
    private final long expirationSeconds;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-seconds:86400}") long expirationSeconds
    ) {
        this.secret = secret;
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(String subject, RoleName role) {
        String header = jsonBase64("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long exp = Instant.now().plusSeconds(expirationSeconds).getEpochSecond();
        String payload = jsonBase64("{\"sub\":\"" + subject + "\",\"role\":\"" + role.name() + "\",\"exp\":" + exp + "}");
        return header + "." + payload + "." + sign(header + "." + payload);
    }

    public String extractSubject(String token) {
        String payloadJson = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]), StandardCharsets.UTF_8);
        return value(payloadJson, "sub");
    }

    public String extractRole(String token) {
        String payloadJson = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]), StandardCharsets.UTF_8);
        return value(payloadJson, "role");
    }

    public boolean isValid(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3 || !sign(parts[0] + "." + parts[1]).equals(parts[2])) {
                return false;
            }
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            long exp = Long.parseLong(value(payloadJson, "exp"));
            return exp > Instant.now().getEpochSecond();
        } catch (Exception ex) {
            return false;
        }
    }

    private String jsonBase64(String json) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes(StandardCharsets.UTF_8));
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Cannot sign JWT", ex);
        }
    }

    private String value(String json, String key) {
        String marker = "\"" + key + "\":";
        int start = json.indexOf(marker);
        if (start < 0) {
            return "";
        }
        start += marker.length();
        if (json.charAt(start) == '"') {
            int end = json.indexOf('"', start + 1);
            return json.substring(start + 1, end);
        }
        int end = json.indexOf(',', start);
        if (end < 0) {
            end = json.indexOf('}', start);
        }
        return json.substring(start, end);
    }
}
