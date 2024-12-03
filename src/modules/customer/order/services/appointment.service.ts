import { OrderService } from './order.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { AppointmentRepository } from '../repositories/appointment.repository';
import { CreateAppointmentDto } from '../dtos/create-appointment.interface';
import { AppointmentEntity } from '../entities/appointment.entity';
import { UpdateAppointmentTimeDto } from '../dtos/update-appointment-time.dto';
import { NotFound } from '@aws-sdk/client-s3';
import { TimeSlotDto } from '../dtos/time-slot.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private orderService: OrderService,
  ) {}

  private async getAppointmentByIdOrThrow(
    appointmentId: number,
  ): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository
      .getRepository()
      .findOne({
        where: {
          appointmentId,
        },
      });

    // Throw an exception if not found
    if (!appointment) {
      throw new NotFoundException(
        `No appointment found with ID ${appointmentId}`,
      );
    }
    return appointment;
  }

  /**
   * Calculates the end time of an appointment based on the start time and the order's fulfillment duration.
   *
   * @param startTime - The start time of the appointment.
   * @param orderId - The ID of the order associated with the appointment.
   * @returns A promise resolving to the calculated end time as a `Date` object.
   *
   * @example
   * const endTime = await this.getEndTime(new Date(), 123);
   * console.log(`End time: ${endTime}`);
   *
   * @throws {NotFoundException} If the order or its fulfillment duration cannot be calculated.
   */
  private async getEndTime(startTime: Date, orderId: number): Promise<Date> {
    // Step 1: Get the fulfillment time for the order in minutes
    const fulfillmentDuration =
      await this.orderService.calculateOrderFullfillmentDuration(orderId);

    // Step 2: Calculate the end time by adding the fulfillment duration to the start time
    const endTime = new Date(startTime.getTime() + fulfillmentDuration * 60000); // Convert minutes to milliseconds

    // Step 3: Return the calculated end time
    return endTime;
  }

  /**
   * Creates a new appointment.
   * @param createAppointmentDto - The data to create the appointment.
   * @returns The created appointment.
   */
  public async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentEntity> {
    const newAppointment = this.appointmentRepository
      .getRepository()
      .create(createAppointmentDto);
    return await this.appointmentRepository
      .getRepository()
      .save(newAppointment);
  }

  /**
   * Deletes an appointment.
   * @param appointmentId - The ID of the appointment to delete.
   * @returns A success message.
   */
  public async cancelAppointment(appointmentId: number): Promise<string> {
    const appointment = await this.appointmentRepository
      .getRepository()
      .findOne({
        where: { appointmentId },
      });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    await this.appointmentRepository.getRepository().remove(appointment);
    return 'Appointment successfully deleted';
  }

  /**
   * Finds an appointment by its ID.
   * @param appointmentId - The ID of the appointment to find.
   * @returns The found appointment or null.
   */
  public async findAppointmentById(
    appointmentId: number,
  ): Promise<AppointmentEntity | null> {
    return await this.appointmentRepository.getRepository().findOne({
      where: { appointmentId },
    });
  }

  /**
   * Retrieves all appointments for a specific customer.
   * @param customerId - The ID of the customer.
   * @returns An array of appointments for the customer.
   */
  public async findAppointmentsByCustomerId(
    customerId: number,
  ): Promise<AppointmentEntity[]> {
    return await this.appointmentRepository
      .getRepository()
      .find({ where: { customerId } });
  }

  /**
   * Updates the appointment time (startTime and optionally endTime).
   * @param appointmentId - The ID of the appointment to update.
   * @param updateAppointmentTimeDto - The new appointment time details.
   * @returns The updated appointment entity.
   * @throws Error if the appointment is not found.
   */
  public async updateAppointmentTime(
    appointmentId: number,
    updateAppointmentTimeDto: UpdateAppointmentTimeDto,
  ): Promise<AppointmentEntity> {
    // Fetch the existing appointment
    const { orderId, startTime } = updateAppointmentTimeDto;
    const appointment = await this.getAppointmentByIdOrThrow(appointmentId);
    appointment.endTime = await this.getEndTime(startTime, orderId);

    //

    // Update the appointment with the new times
    Object.assign(appointment, updateAppointmentTimeDto);

    // Save the updated appointment
    return this.appointmentRepository.getRepository().save(appointment);
  }

  /**
   * Returns the occupied time slots for a specific outlet.
   * Ensures time slots are rounded to the nearest 30-minute intervals.
   *
   * @param outletId - The ID of the outlet for which to fetch the occupied time slots.
   * @returns A promise resolving to an array of occupied time slots in the format [{ startTime: Date, endTime: Date }].
   *
   * @example
   * const timeSlots = await this.getOccupiedTimeSlots(1);
   * console.log(timeSlots);
   */
  public async getOccupiedTimeSlots(outletId: number): Promise<TimeSlotDto[]> {
    // Fetch all appointments for the specified outlet
    const appointments = await this.appointmentRepository.getRepository().find({
      where: { outletId },
      order: { startTime: 'ASC' },
    });

    // Map to formatted time slots with 30-minute interval adjustments
    const occupiedTimeSlots = appointments.map((appointment) => {
      const adjustedStartTime = this.roundToNearest30Minutes(
        appointment.startTime,
      );
      const adjustedEndTime = this.roundToNearest30Minutes(appointment.endTime);

      return {
        startTime: adjustedStartTime,
        endTime: adjustedEndTime,
      };
    });

    return occupiedTimeSlots;
  }

  /**
   * Rounds a given time to the nearest 30-minute interval.
   *
   * @param time - The `Date` object to round.
   * @returns A new `Date` object rounded to the nearest 30-minute interval.
   */
  private roundToNearest30Minutes(time: Date): Date {
    const roundedTime = new Date(time);
    const minutes = roundedTime.getMinutes();

    // Round minutes to the nearest 30-minute interval
    if (minutes < 15) {
      roundedTime.setMinutes(0, 0, 0); // Round down to the hour
    } else if (minutes < 45) {
      roundedTime.setMinutes(30, 0, 0); // Round to the half-hour
    } else {
      roundedTime.setMinutes(0, 0, 0); // Round up to the next hour
      roundedTime.setHours(roundedTime.getHours() + 1);
    }

    return roundedTime;
  }
}
