interface UpdateServicesInterface {
    serviceId: string;
    updatedKeys: {
      serviceImages?: string[];
      serviceVideos?: string[];
      subtypeImage: string;
    };
  }
  
 export interface UpdateServiceKeysResponseInterface {
    results: UpdateServicesInterface[];
    errors: Array<{
      serviceId: string;  
      error: string;
    }>;
  }
  