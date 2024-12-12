import { OpenOrderResponseInterface } from "./open-orders.interface";

export interface UpcomingOrdersResponseInterface extends Omit<OpenOrderResponseInterface,'services'|'contact'|'email'>{}
