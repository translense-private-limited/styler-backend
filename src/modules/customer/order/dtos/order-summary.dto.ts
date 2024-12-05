import { ApiProperty } from "@nestjs/swagger";
import { OrderItemSummaryDto } from "./order-item-summary.dto";
import { IsNotEmpty } from "class-validator";

  // OrderSummaryDto
  export class OrderSummaryDto {
    @ApiProperty()
    @IsNotEmpty()
    orderId: string;
  
    @ApiProperty()
    @IsNotEmpty()
    salonName: string;
  
    @ApiProperty()
    @IsNotEmpty()
    orderDate: string;
  
    @ApiProperty({ type: [OrderItemSummaryDto] })
    @IsNotEmpty()
    items: OrderItemSummaryDto[];
  
    @ApiProperty()
    @IsNotEmpty()
    itemTotal: number;
  
    @ApiProperty()
    @IsNotEmpty()
    grandTotal: number;
  }