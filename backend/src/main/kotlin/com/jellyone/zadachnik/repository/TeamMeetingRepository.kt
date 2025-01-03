package com.jellyone.zadachnik.repository

import com.jellyone.zadachnik.domain.TeamMeeting
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface TeamMeetingRepository : JpaRepository<TeamMeeting, Long>, JpaSpecificationExecutor<TeamMeeting> {

}