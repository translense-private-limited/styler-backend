const fs = require('fs');
const path = require('path');

// Function to capitalize the first letter of the name
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const createFoldersAndFiles = (name, location) => {
  const basePath = path.join(location, name);
  const capitalizedName = capitalize(name);

  // Define folders
  const folders = [
    'enums',
    'services',
    'interfaces',
    'dtos',
    'repository',
    'controllers',
    'entities',
  ];

  // Create base folder with name at the specified location
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  // Create subfolders
  folders.forEach((folder) => {
    const folderPath = path.join(basePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  });

  // Create the repository file
  const repositoryFilePath = path.join(
    basePath,
    'repository',
    `${name}.repository.ts`,
  );
  const repositoryFileContent = `
import { InjectRepository } from "@nestjs/typeorm";
import { ${capitalizedName}Entity } from "../entities/${name}.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class ${capitalizedName}Repository extends BaseRepository<${capitalizedName}Entity> {
    constructor(
        @InjectRepository(${capitalizedName}Entity, getMysqlDataSource())
        protected repository: Repository<${capitalizedName}Entity>,
    ) {
        super(repository);
    }
}
`.trim();
  fs.writeFileSync(repositoryFilePath, repositoryFileContent);

  // Create the entity file
  const entityFilePath = path.join(basePath, 'entities', `${name}.entity.ts`);
  const entityFileContent = `
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@src/utils/entities/base.entity";

@Entity()
export class ${capitalizedName}Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
`.trim();
  fs.writeFileSync(entityFilePath, entityFileContent);

  // Create the module file
  const moduleFilePath = path.join(basePath, `${name}.module.ts`);
  const moduleFileContent = `
import { Module } from "@nestjs/common";
import { ${capitalizedName}Service } from "./services/${name}.service";
import { ${capitalizedName}Repository } from "./repository/${name}.repository";
import { ${capitalizedName}Controller } from "./controllers/${name}.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ${capitalizedName}Entity } from "./entities/${name}.entity";
import { getMysqlDataSource } from "@modules/database/data-source";

@Module({
    imports: [
        TypeOrmModule.forFeature([${capitalizedName}Entity], getMysqlDataSource())
    ],
    providers: [${capitalizedName}Service, ${capitalizedName}Repository],
    controllers: [${capitalizedName}Controller]
})
export class ${capitalizedName}Module { }
`.trim();
  fs.writeFileSync(moduleFilePath, moduleFileContent);

  // Create the controller file
  const controllerFilePath = path.join(
    basePath,
    'controllers',
    `${name}.controller.ts`,
  );
  const controllerFileContent = `
import { Controller, Get, Post } from "@nestjs/common";
import { ${capitalizedName}Service } from "../services/${name}.service";

@Controller('${name}')
export class ${capitalizedName}Controller {
  constructor(private readonly ${name}Service: ${capitalizedName}Service) {}

  @Get()
  findAll() {
    return this.${name}Service.findAll();
  }

  @Post()
  create() {
    return this.${name}Service.create();
  }
}
`.trim();
  fs.writeFileSync(controllerFilePath, controllerFileContent);

  // Create the service file
  const serviceFilePath = path.join(basePath, 'services', `${name}.service.ts`);
  const serviceFileContent = `
import { Injectable } from "@nestjs/common";
import { ${capitalizedName}Repository } from "../repository/${name}.repository";

@Injectable()
export class ${capitalizedName}Service {
  constructor(private ${capitalizedName}Repository: ${capitalizedName}Repository) {}

  findAll() {
    // Logic for finding all records
    return [];
  }

  create() {
    // Logic for creating a new record
    return this.${capitalizedName}Repository.getRepository().save();
  }
}
`.trim();
  fs.writeFileSync(serviceFilePath, serviceFileContent);

  console.log(
    `Folders and files for ${name} created successfully at ${location}!`,
  );
};

// Get the input name and location from command line arguments
const inputName = process.argv[2];
const inputLocation = process.argv[3];

if (!inputName || !inputLocation) {
  console.log('Please provide a name and location.');
} else {
  createFoldersAndFiles(inputName, inputLocation);
}
