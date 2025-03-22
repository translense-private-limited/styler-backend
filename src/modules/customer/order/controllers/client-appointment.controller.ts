import {
    Controller,
    Param,
    ParseIntPipe,
    Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentService } from '../services/appointment.service';
import { TimeSlotDto } from '../dtos/time-slot.dto';


@ApiTags('Client Appointments')
@Controller('client')
export class CLientAppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }


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
