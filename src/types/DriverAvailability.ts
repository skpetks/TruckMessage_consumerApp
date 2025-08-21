export type DriverAvailability = {
    id: number;
    driverId: number;
    availableFrom: string;
    availableTo: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }

  export type DriverAvailabilityType = {
    id: number;
    driverId: number;
    isAvailable: boolean;
    currentLocation: string;
    availableFrom: string;   // ISO date string
    createdAt: string;       // ISO date string
    updateAt: string;        // ISO date string
    recordStatus: number;
    cancelledDate: string;   // YYYY-MM-DD
  }