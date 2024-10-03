// import { Injectable } from '@nestjs/common';
// import { CustomerAuthService } from './customer-auth.service';
// import { SellerAuthService } from './seller-auth.service';


// @Injectable()
// export class AuthServiceFactory {
//   constructor(
//     private customerAuthService: CustomerAuthService,
//     private sellerAuthService: ClientA,
//     //private adminAuthService: AdminAuthService,
//   ) {}

//   getAuthService(userType: string): AuthServiceInterface {
//     switch (userType) {
//       case 'customer':
//         return this.customerAuthService;
//       case 'seller':
//         return this.sellerAuthService;
//       case 'admin':
//         return this.adminAuthService;
//       default:
//         throw new Error('Invalid user type');
//     }
//   }
// }
