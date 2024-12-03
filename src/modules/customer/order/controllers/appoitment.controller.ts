import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentEntity } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dtos/create-appointment.interface';
import { UpdateAppointmentTimeDto } from '../dtos/update-appointment-time.dto';
import { TimeSlotDto } from '../dtos/time-slot.dto';

/**
 * Controller for handling appointment-related operations.
 * This controller is intended for use by customers only.
 * Base endpoint: /customer/appointments
 */
@ApiTags('Customer Appointments')
@Controller('customer')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * Create a new appointment.
   * @param createAppointmentDto - Data to create a new appointment.
   * @returns The created appointment entity.
   */
  @Post('appointment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The appointment was successfully created.',
    type: AppointmentEntity,
  })
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentEntity> {
    return await this.appointmentService.createAppointment(
      createAppointmentDto,
    );
  }

  /**
   * Cancel (delete) an existing appointment.
   * @param appointmentId - The ID of the appointment to delete.
   * @returns A success message upon successful deletion.
   */
  @Delete('appointment/:appointmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel an existing appointment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The appointment was successfully canceled.',
  })
  async cancelAppointment(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ): Promise<void> {
    await this.appointmentService.cancelAppointment(appointmentId);
  }

  /**
   * Update the booking time of an appointment.
   * @param appointmentId - The ID of the appointment to update.
   * @param updateAppointmentDto - The updated booking time details.
   * @returns The updated appointment entity.
   */
  @Patch(':appointmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update booking time or other appointment details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The appointment was successfully updated.',
    type: AppointmentEntity,
  })
  async updateAppointment(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() updateAppointmentDto: UpdateAppointmentTimeDto,
  ): Promise<AppointmentEntity> {
    return await this.appointmentService.updateAppointmentTime(
      appointmentId,
      updateAppointmentDto,
    );
  }

  /**
   * Retrieves the occupied time slots for a specific outlet.
   * @param outletId - The ID of the outlet.
   * @returns An array of occupied time slots.
   */
  @Get('outlet/:outletId/occupied-slots')
  @ApiOperation({
    summary: 'Get occupied time slots for an outlet',
    description:
      'Fetches the timeline that is already booked for an outlet, ensuring it adheres to 30-minute intervals.',
  })
  @ApiResponse({
    status: 200,
    description: 'An array of occupied time slots.',
    schema: {
      example: [
        {
          startTime: '2024-12-04T12:00:00.000Z',
          endTime: '2024-12-04T12:30:00.000Z',
        },
        {
          startTime: '2024-12-04T13:00:00.000Z',
          endTime: '2024-12-04T13:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No appointments found for the given outlet.',
  })
  async getOccupiedTimeSlots(
    @Param('outletId', ParseIntPipe) outletId: number,
  ): Promise<TimeSlotDto[]> {
    return await this.appointmentService.getOccupiedTimeSlots(outletId);
  }
}
