package com.crm.system.security;

import com.crm.system.controller.AuthController;
import com.crm.system.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@Import({WebSecurityConfig.class, JwtAuthEntryPoint.class})
class WebSecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void permitsAuthEndpointsWithApiPrefix() throws Exception {
        mockMvc.perform(get("/api/auth/public"))
                .andExpect(status().isOk());
    }

    @Test
    void permitsAuthEndpointsWithForwardedPrefixContext() throws Exception {
        mockMvc.perform(get("/auth/public").with(request -> {
                    request.setContextPath("/api");
                    request.setRequestURI("/api/auth/public");
                    request.setServletPath("/auth/public");
                    return request;
                }))
                .andExpect(status().isOk());
    }
}
