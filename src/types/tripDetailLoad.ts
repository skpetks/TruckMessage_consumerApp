export type TripDetailLoad = {
    id: number;
    tripId: number;
    loadId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }

  export type TripDetailLoadPayload = {
    id: number;
    truck: string;
    userId: number;
    postUserID: number;
    organizationName: string;
    dealCloseUserID: number;
    phoneNumber: string;
    buyerInformation: string;
    fromLocation: string;
    toLocation: string;
    material: string;
    ton: number;
    truckBodyType: string;
    description: string;
    numberOfTyres: number;
    createdAt: string;   // ISO date string
    updateAt: string;    // ISO date string
    recordStatus: number;
    cancelledDate: string; // YYYY-MM-DD
  }
  