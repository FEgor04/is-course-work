package com.jellyone.zadachnik.repository

import com.jellyone.zadachnik.domain.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface ProductRepository : JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

}