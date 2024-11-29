import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepositoy } from "../repositories/order.repository";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { OrderItemRepository } from "../repositories/order-item.repository";
import { OutletExternalService } from "@modules/client/outlet/services/outlet-external.service";
import { CustomerDecoratorDto } from "@src/utils/dtos/customer-decorator.dto";
import { ServicesDto } from "../dtos/services.dto";

@Injectable()
export class OrderService{
    constructor( private readonly orderRepositoy: OrderRepositoy,
        private readonly orderItemRepository:OrderItemRepository,
        private readonly outletExternalService:OutletExternalService
    ){}

    async createOrder(createOrderDto:CreateOrderDto,customer:CustomerDecoratorDto):Promise<CreateOrderDto>{
        const {services,customerId,paymentId} = createOrderDto;

        let totalPrice = 0;
        const orderItems = [];
        const serviceDtos:ServicesDto[] = [];

        for(const service of services){
            const {serviceId,quantity,outletId,startTime,notes} = service;

            const serviceData = await this.validateServiceAndOutlet(outletId,serviceId,customer);
            if(!serviceData){
                throw new BadRequestException(`Invalid  serviceId:${serviceId} or outletId:${outletId}`)
            }

            const { price, duration, discount } = serviceData;
            const totalDuration = duration * quantity; 
            const endTime = new Date(new Date(startTime).getTime() + (totalDuration * 60000))
            
            const discountedPrice = price - (price * (discount / 100));
            
            const serviceTotal = discountedPrice * quantity;
            totalPrice += serviceTotal;

            orderItems.push(this.orderItemRepository.getRepository().create({
                serviceId,quantity,discount:discount,notes,
            }))

            serviceDtos.push({ serviceId,startTime,endTime,quantity,outletId,notes,});
            }

            const order = this.orderRepositoy.getRepository().create({price:totalPrice,paymentId,customerId})
            const savedOrder = await this.orderRepositoy.getRepository().save(order);
            // Assuming orderItems is an array of OrderItemEntity objects
            await this.orderItemRepository.getRepository().save(
                orderItems.map(item => ({
                ...item,                
                order: savedOrder,      
                }))
            );
            return {services:serviceDtos,customerId,paymentId};
    }

    private async validateServiceAndOutlet( outletId: number,serviceId: string,customer:CustomerDecoratorDto) {
        const service = await this.outletExternalService.getServiceByServiceAndOutletId(outletId,serviceId,customer)
        return { price: service.price, duration: service.timeTaken,discount:service.discount }; 
    }
    
}