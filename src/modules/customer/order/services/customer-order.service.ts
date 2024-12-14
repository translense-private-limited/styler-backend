import { Injectable } from "@nestjs/common";
import { ClientOrdersService } from "./client-order.service";
import { OrderFilterDto } from "../dtos/order-filter.dto";
import { OrderDetailsInterface } from "../interfaces/client-orders.interface";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { ServiceExternalService } from "@modules/client/services/services/service-external.service";

@Injectable()
export class CustomerOrderService{
    constructor(
        private readonly clientOrderService:ClientOrdersService,
        private readonly appointmentRepository:AppointmentRepository,
        private readonly serviceExternalService:ServiceExternalService
    ){}

    async getUpcomingOrders(
        customerId:number,
        dateRange:OrderFilterDto
    ){
        const {startTime,endTime} = dateRange;
        const currentTime = new Date();
        if (startTime > endTime) {
        throw new Error("Start time cannot be later than end time.");
        }
        if (new Date(startTime) < currentTime) {
        throw new Error("Start time cannot be in the past.");
        }
        const bufferTime = new Date(new Date(startTime).getTime() - 30 * 60 * 1000);
        // Fetch upcoming orders based on the startTime from AppointmentEntity
        const upcomingOrders: OrderDetailsInterface[] = await this.appointmentRepository.getCustomerUpcomingOrders(customerId,bufferTime,endTime);

        // Extract unique serviceIds
        const serviceIds = [...new Set(upcomingOrders.map(order => order.serviceId))];

        // Fetch services by serviceIds
        const services = await this.serviceExternalService.getServicesByServiceIds(serviceIds);

        // Format the results into the desired structure
        return this.clientOrderService.formatOrderResponse(upcomingOrders, services);
    }
}