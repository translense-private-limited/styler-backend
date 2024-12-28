import { EventDataInterface } from '../../interfaces/event-data.interface';

//import { EventNameEnum } from './../../enums/event-name.enum';
// this is the dto that needs to be passed to event publisher
// while publishing the event

// nomenclature for class name

// {EventName}.{EventData}.dto

// const className = `${EventNameEnum.ORDER_PLACED}.EventDataDto`;

export class OrderPlacedEventDataDto implements EventDataInterface {
  name: string;
}
