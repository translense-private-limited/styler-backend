import { CreateClientDto } from "@modules/client/client/dtos/client.dto";
import { CreateOutletDto } from "./outlet.dto";

export class CreateOutletWithClientDto {
    client: CreateClientDto;
    outlet: CreateOutletDto;
  }
  