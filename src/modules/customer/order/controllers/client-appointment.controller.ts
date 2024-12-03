// import {
//   Controller,
//   Get,
//   Param,
//   Delete,
//   Body,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { TimeSlotDto } from '../dtos/time-slot.dto';

// @ApiTags('client/appointment')
// @Controller('client/appointment')
// export class ClientAppointmentController {
//   constructor(
//     private readonly clientAppointmentService: ClientAppointmentService,
//   ) {}

//   /**
//    * Get the list of occupied and unoccupied slots for a given outlet.
//    * @param outletId - The ID of the outlet for which to fetch time slots.
//    * @returns List of occupied and unoccupied time slots.
//    */
//   @Get(':outletId/time-slots')
//   async getTimeSlots(
//     @Param('outletId', ParseIntPipe) outletId: number,
//   ): Promise<TimeSlotDto[]> {
//     return await this.clientAppointmentService.getTimeSlots(outletId);
//   }

//   /**
//    * Cancel an existing appointment for a customer.
//    * @param appointmentId - The ID of the appointment to cancel.
//    * @param cancelAppointmentDto - The data required to cancel the appointment.
//    * @returns Confirmation of cancellation.
//    */
//   @Delete(':appointmentId')
//   async cancelAppointment(
//     @Param('appointmentId', ParseIntPipe) appointmentId: number,
//     @Body() cancelAppointmentDto: CancelAppointmentDto,
//   ): Promise<string> {
//     return await this.clientAppointmentService.cancelAppointment(
//       appointmentId,
//       cancelAppointmentDto,
//     );
//   }
// }
