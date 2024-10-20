import { Module } from "@nestjs/common";
import { OutletModule } from "./outlet/outlet.module";

// due to conflict this name have modified
import { ClientModule as clientModule } from "./client/client.module"



@Module({
    imports: [ OutletModule, clientModule],
    exports: [clientModule]
 })
export class ClientModule{}