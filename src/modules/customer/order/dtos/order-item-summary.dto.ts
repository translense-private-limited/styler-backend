import { ApiProperty } from "@nestjs/swagger";

// OrderItemDto
export class OrderItemSummaryDto {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    quantity: number;
  
    @ApiProperty()
    unitPrice: number;
  
    @ApiProperty()
    totalPrice: number;
  }

  