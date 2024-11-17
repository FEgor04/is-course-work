package com.jellyone.zadachnik.service.impl

import com.jellyone.zadachnik.domain.User
import com.jellyone.zadachnik.service.AuthService
import com.jellyone.zadachnik.service.UserService
import com.jellyone.zadachnik.web.security.JwtTokenProvider
import com.jellyone.zadachnik.web.dto.auth.JwtRequest
import com.jellyone.zadachnik.web.dto.auth.JwtResponse
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationManager

@Service
class AuthServiceImpl @Autowired constructor(
    private val authenticationManager: AuthenticationManager,
    private val userService: UserService,
    private val jwtTokenProvider: JwtTokenProvider
) : AuthService {

    override fun login(loginRequest: JwtRequest): JwtResponse {
        try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    loginRequest.username,
                    loginRequest.password
                )
            )
        } catch (e: Exception) {
            throw BadCredentialsException(e.message)
        }

        val user: User = userService.getByUsername(loginRequest.username)

        return JwtResponse(
            user.id,
            user.username,
            jwtTokenProvider.createAccessToken(user.id, user.username, user.role),
            jwtTokenProvider.createRefreshToken(user.id, user.username)
        )
    }

    override fun refresh(refreshToken: String): JwtResponse {
        return jwtTokenProvider.refreshUserTokens(refreshToken)
    }
}