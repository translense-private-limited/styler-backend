import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { GenderEnum } from '@src/utils/enums/gender.enums';
import { ServiceRepository } from '@modules/client/services/repositories/service.repository';

@Injectable()
export class SeedServiceData {
  constructor(
    private readonly serviceRepository:ServiceRepository
  ) {}

  async seedServices(): Promise<void> {
    const services = [
      // Hair Styling
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3cd'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Classic Haircut',
        type: 'Basic',
        price: 500,
        discount: 10,
        timeTaken: 30,
        about: 'A simple and clean haircut tailored to your preference.',
        description: 'Includes shampoo and conditioning before the haircut.',
        outletId: 1,
        whitelabelId: 1,
      },
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3cd'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Advanced Hair Coloring',
        type: 'Premium',
        price: 3500,
        discount: 15,
        timeTaken: 120,
        about: 'Professional hair coloring with vibrant and lasting shades.',
        description: 'Includes a consultation to select the perfect color for your hair.',
        outletId: 1,
        whitelabelId: 1,
      },

      // Facial Treatments
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3ce'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Gold Facial',
        type: 'Premium',
        price: 2000,
        discount: 5,
        timeTaken: 60,
        about: 'A luxurious facial treatment with gold-infused products.',
        description: 'Rejuvenates the skin and gives a natural glow.',
        outletId: 1,
        whitelabelId: 1,
      },
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3ce'),
        gender: GenderEnum.MALE,
        serviceName: 'Deep Cleansing Facial',
        type: 'Basic',
        price: 1500,
        discount: 0,
        timeTaken: 45,
        about: 'Cleanses deep-seated dirt and impurities.',
        description: 'Includes steaming, exfoliation, and a hydrating mask.',
        outletId: 1,
        whitelabelId: 1,
      },

      // Manicure & Pedicure
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3cf'),
        gender: GenderEnum.MALE,
        serviceName: 'Classic Manicure',
        type: 'Basic',
        price: 800,
        discount: 0,
        timeTaken: 30,
        about: 'Pamper your hands with this essential care.',
        description: 'Includes nail trimming, shaping, and polish application.',
        outletId: 2,
        whitelabelId: 1,
      },
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3cf'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Deluxe Pedicure',
        type: 'Premium',
        price: 1200,
        discount: 10,
        timeTaken: 45,
        about: 'Relaxing pedicure with exfoliation and massage.',
        description: 'Includes callus removal and hydrating foot cream.',
        outletId: 2,
        whitelabelId: 1,
      },

      // Makeup & Bridal Services
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d0'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Bridal Makeup',
        type: 'Premium',
        price: 15000,
        discount: 20,
        timeTaken: 180,
        about: 'Flawless bridal makeup for your special day.',
        description: 'Includes a trial session and hairstyling.',
        outletId: 2,
        whitelabelId: 1,
      },
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d0'),
        gender: GenderEnum.MALE,
        serviceName: 'Party Makeup',
        type: 'Basic',
        price: 3000,
        discount: 5,
        timeTaken: 90,
        about: 'Trendy makeup for parties and events.',
        description: 'Customized makeup to match your outfit and occasion.',
        outletId: 2,
        whitelabelId: 1,
      },

      // Massage Therapy
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d1'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Aromatherapy Massage',
        type: 'Premium',
        price: 4000,
        discount: 10,
        timeTaken: 90,
        about: 'Relaxing massage with essential oils.',
        description: 'Releases stress and rejuvenates the senses.',
        outletId: 1,
        whitelabelId: 1,
      },
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d1'),
        gender: GenderEnum.MALE,
        serviceName: 'Swedish Massage',
        type: 'Basic',
        price: 3500,
        discount: 0,
        timeTaken: 60,
        about: 'A traditional massage focusing on muscle relaxation.',
        description: 'Uses long, gliding strokes to improve circulation.',
        outletId: 1,
        whitelabelId: 1,
      },

      // Waxing & Threading
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d2'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Full Body Waxing',
        type: 'Premium',
        price: 2500,
        discount: 10,
        timeTaken: 120,
        about: 'Complete body hair removal for smooth skin.',
        description: 'Uses high-quality wax for minimal discomfort.',
        outletId: 1,
        whitelabelId: 1,
      },
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d2'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Eyebrow Threading',
        type: 'Basic',
        price: 300,
        discount: 0,
        timeTaken: 15,
        about: 'Precision eyebrow shaping with threading technique.',
        description: 'Gentle on the skin and provides defined brows.',
        outletId: 2,
        whitelabelId: 1,
      },

      // Hair Spa
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d3'),
        gender: GenderEnum.MALE,
        serviceName: 'Moisturizing Hair Spa',
        type: 'Premium',
        price: 2000,
        discount: 10,
        timeTaken: 90,
        about: 'Deep conditioning treatment for dry and damaged hair.',
        description: 'Restores moisture and improves hair texture.',
        outletId: 2,
        whitelabelId: 1,
      },
      {
        categoryId: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d3'),
        gender: GenderEnum.FEMALE,
        serviceName: 'Anti-Dandruff Hair Spa',
        type: 'Basic',
        price: 1800,
        discount: 5,
        timeTaken: 60,
        about: 'Effective hair spa for dandruff control.',
        description: 'Reduces scalp itchiness and flakes.',
        outletId: 2,
        whitelabelId: 1,
      },
    ];
    await this.serviceRepository.getRepository().deleteMany({});
    const serviceDocuments = services.map((service) =>
      this.serviceRepository.getRepository().create(service),
    );
    const resolvedDocuments = await Promise.all(serviceDocuments);
    await this.serviceRepository.getRepository().bulkSave(resolvedDocuments);
  }
}
