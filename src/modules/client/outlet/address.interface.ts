export interface CountryInterface{
    name: string; 
    isoCode: string; // Country ISO code (e.g., "IN" for India)
    phonecode: string; // Country dialing code
    currency: string; // Country currency
    latitude: string; // Latitude of the country
    longitude: string; // Longitude of the country
    flag: string; // Flag emoji
  }

export interface StateInterface{
    name: string; // State name
    isoCode: string; // State ISO code
    countryCode: string; // Country ISO code the state belongs to
}

export interface CityInterface{
    name: string;
    countryCode: string;
    stateCode: string;
}