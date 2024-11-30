export interface OrderInterface{
    orderId:number;
    amountPaid:number;
    paymentId?:string;
    customerId:number;
    outletId:number
}