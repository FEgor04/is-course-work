package com.jellyone.zadachnik.controller

import com.jellyone.zadachnik.exception.ErrorMessage
import com.jellyone.zadachnik.service.SprintService
import com.jellyone.zadachnik.web.dto.SprintModel
import com.jellyone.zadachnik.web.request.CreateSprintRequest
import com.jellyone.zadachnik.web.request.UpdateMeetingRequest
import com.jellyone.zadachnik.web.request.UpdateSprintRequest
import com.jellyone.zadachnik.web.response.SprintResponse
import com.jellyone.zadachnik.web.response.TaskResponse
import com.jellyone.zadachnik.web.response.toResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import lombok.RequiredArgsConstructor
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.security.Principal


@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Validated
@Tag(name = "Sprints API")
@ApiResponses(
    ApiResponse(
        responseCode = "400",
        description = "Invalid input",
        content = [Content(schema = Schema(implementation = ErrorMessage::class), mediaType = "application/json")]
    )
)
class SprintController(
    private val sprintService: SprintService
) {
    @PostMapping("/{teamId}/sprints")
    @Operation(
        summary = "Create Sprint",
        description = "Create a new sprint",
        operationId = "createSprint",
        responses = [
            io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Sprint is created",
                content = [
                    io.swagger.v3.oas.annotations.media.Content(
                        mediaType = "application/json",
                        schema = io.swagger.v3.oas.annotations.media.Schema(implementation = SprintResponse::class)
                    )
                ]
            )
        ]
    )
    fun createSprint(
        @PathVariable("teamId") teamId: Long,
        @Valid @RequestBody request: CreateSprintRequest,
        principal: Principal
    ) = sprintService.createSprint(
        teamId,
        SprintModel(
            length = request.length,
            startAt = request.startsAt,
            tasksIds = request.tasksIds,
            planningDateTime = request.planningDateTime,
            retroDateTime = request.retroDateTime,
            reviewDateTime = request.reviewDateTime,
        )
    ).toResponse()

    @GetMapping("/{teamId}/sprints/{sprintId}")
    fun getSprintsByTeamIdAndSprintId(
        @PathVariable("teamId") teamId: Long,
        @PathVariable("sprintId") sprintId: Long
    ) = sprintService.getSprintById(sprintId).toResponse()

    @PutMapping("/{teamId}/sprints/{sprintId}")
    fun updateSprintByTeamIdAndSprintId(
        @PathVariable("teamId") teamId: Long,
        @PathVariable("sprintId") sprintId: Long,
        @Valid @RequestBody request: UpdateSprintRequest
    ) = sprintService.updateSprintById(
        sprintId = sprintId,
        length = request.length,
        startAt = request.startsAt,
        tasksIds = request.tasksIds,
    ).toResponse()

    @PutMapping("/{teamId}/sprints/{sprintId}/meeting")
    fun updateMeetingBySprintIdAndMeetingType(
        @PathVariable("teamId") teamId: Long,
        @PathVariable("sprintId") sprintId: Long,
        @Valid @RequestBody request: UpdateMeetingRequest
    ) = sprintService.updateMeeting(
        sprintId = sprintId,
        meetingType = request.type,
        agenda = request.agenda,
        date = request.date,
    ).toResponse()

    @GetMapping("/{teamId}/sprints/{sprintId}/tasks")
    fun getSprintTasks(
        @PathVariable("teamId") teamId: Long,
        @PathVariable("sprintId") sprintId: Long,
        @RequestParam(required = false) assigneeId: Long?,
        @RequestParam(required = false) productId: Long?,
        @RequestParam(required = false) status: String?,
        @RequestParam(defaultValue = "0") pageNumber: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ) =
        sprintService.getSprintTasksByTeamIdAndSprintId(
            sprintId = sprintId,
            assigneeId = assigneeId,
            productId = productId,
            status = status,
            PageRequest.of(pageNumber, pageSize)
        ).map { task ->
            task.toResponse()
        }

    @GetMapping("/{teamId}/sprints")
    fun getSprintsByTeamId(
        @PathVariable("teamId") teamId: Long,
        @RequestParam(defaultValue = "0") pageNumber: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ) = sprintService.getSprintsByTeamId(teamId, pageNumber, pageSize).map { sprint ->
        sprint.toResponse()
    }

    @GetMapping("/products/{productId}/sprints")
    fun getSprintsByProductId(
        @PathVariable("productId") productId: Long,
        @RequestParam(defaultValue = "0") pageNumber: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ) = sprintService.getSprintsByProductId(productId, pageNumber, pageSize).map { sprint ->
        sprint.toResponse()
    }
}