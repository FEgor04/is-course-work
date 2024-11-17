package com.jellyone.zadachnik.domain

import com.jellyone.zadachnik.domain.enums.Role
import jakarta.persistence.*
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    @Column
    private val username: String,
    @Column
    private val password: String,
    @Column(name = "fullname")
    private val fullName: String,
    val role: Role
) : UserDetails {
    override fun getAuthorities(): Collection<SimpleGrantedAuthority> {
        val list = mutableListOf<SimpleGrantedAuthority>()
        list.add(SimpleGrantedAuthority(role.toString()))
        return list
    }

    override fun getPassword(): String {
        return password
    }

    override fun getUsername(): String {
        return username
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }

}