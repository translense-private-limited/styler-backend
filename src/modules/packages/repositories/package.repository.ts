import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseSchema } from '@src/utils/repositories/base-schema';
import { getMongodbDataSource } from '@modules/database/data-source';
import { PackageSchema } from '../schema/package-schema';

@Injectable()
export class PackageRepository extends BaseSchema<PackageSchema> {
    private readonly packageRepository: Model<PackageSchema>;

    constructor(
        @InjectModel(PackageSchema.name, getMongodbDataSource())
        packageModel: Model<PackageSchema>,
    ) {
        super(packageModel);
        this.packageRepository = packageModel;
    }

}