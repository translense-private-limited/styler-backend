import { Module } from "@nestjs/common";
import { OutletModule } from "./outlet/outlet.module";
import { OwnerModule } from "./owner/owner.module";

@Module({
    imports: [ OutletModule, OwnerModule]
 })
export class SellerModule{}