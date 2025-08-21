export interface LoadAvailabilityType {
    id: number;
    loadTypeId: number;
    pickupLocation: string;
    dropLocation: string;
    availableFrom: string;  // ISO date string
    availableTo: string;    // ISO date string
    userId: number;
    createdAt: string;      // ISO date string
    updateAt: string;       // ISO date string
    cancel: boolean;
    cancelledDate: string;  // YYYY-MM-DD
  }
  