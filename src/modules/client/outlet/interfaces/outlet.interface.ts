import { ClientEntity } from '@modules/client/client/entities/client.entity';
import { CreateOutletDto } from '../dtos/outlet.dto';

export class OutletInterface {
  outlet: CreateOutletDto;
  clientName: string;
  owner?: Partial<ClientEntity>;
}
