export type Vehicle = {
    id: number;
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    ownerName: string;
    ownerPhone: string;
    createdAt: string;
    updateAt: string;
    recordStatus: number;
  }

  export type CreateVehicleRequest = {
    id: number;
    vehicleNumber: string;
    truckTypeId: number;
    truckBodyType: string;
    numberOfTyres: number;
    loadCapacity: number;
    ownerId: number;
    insuranceId: number;
    rcDocument: string;
    vehicleImage: string;
    createdAt: string;
    updatedAt: string;
  }