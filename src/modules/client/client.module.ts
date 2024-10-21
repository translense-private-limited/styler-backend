import { Module } from "@nestjs/common";
import { OutletModule } from "./outlet/outlet.module";

// due to conflict this name have modified
import { ClientModule as ClientUserModule } from "./client/client.module"
import { ClientOutletMappingModule } from "@modules/admin/client-outlet-mapping/client-outlet-mapping.module";



@Module({
    imports: [ OutletModule, ClientUserModule, ClientOutletMappingModule],
    exports: [ClientUserModule]
 })
export class ClientModule{}