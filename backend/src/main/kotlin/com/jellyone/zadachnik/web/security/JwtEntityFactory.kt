package com.jellyone.zadachnik.web.security

import com.jellyone.zadachnik.domain.User
import com.jellyone.zadachnik.domain.enums.Role
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

object JwtEntityFactory {
    fun create(user: User): JwtEntity {
        return JwtEntity(
            username = user.username,
            password = user.password,
            authorities = mapToGrantedAuthorities(listOf(user.role)),
            id = user.id
        )
    }

    private fun mapToGrantedAuthorities(roles: List<Role>): List<GrantedAuthority> {
        return roles.map { SimpleGrantedAuthority(it.name) }
    }
}