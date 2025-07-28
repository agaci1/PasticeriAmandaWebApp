package com.amanda.pasticeri.security;

import com.amanda.pasticeri.model.User;
import com.amanda.pasticeri.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String header = request.getHeader("Authorization");
            System.out.println("🛡️ JWT Filter triggered for: " + request.getRequestURI());

            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                System.out.println("🔐 Token extracted");

                if (tokenProvider.validateToken(token)) {
                    System.out.println("✅ Token is valid");

                    String email = tokenProvider.getEmailFromJWT(token);
                    String roles = tokenProvider.getRoleFromJWT(token);
                    System.out.println("📧 Processing authentication for email: " + email);

                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

                    // Handle multiple roles
                    List<SimpleGrantedAuthority> authorities = Arrays.stream(roles.split(","))
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.trim().toUpperCase()))
                            .collect(Collectors.toList());

                    System.out.println("🔑 Granted authorities: " + authorities);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user, null, authorities
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("🔓 Security context updated successfully");
                } else {
                    System.out.println("❌ Token validation failed");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } else {
                System.out.println("⚠️ No valid Authorization header found");
            }
        } catch (Exception e) {
            System.out.println("❌ Authentication error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
