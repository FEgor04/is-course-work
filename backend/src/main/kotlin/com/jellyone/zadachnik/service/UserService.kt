package com.jellyone.zadachnik.service

import com.jellyone.zadachnik.domain.User

interface UserService {
    fun register(username: String, fullName: String, password: String)

    fun getById(id: Long): User

    fun getByUsername(username: String): User
}