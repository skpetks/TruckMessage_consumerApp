import { CREATE_VEHICLE, DELETE_VEHICLE, TRUCK_BODY_TYPE, TRUCK_TYPE, VEHICLE, VEHICLE_BY_ID } from "../const";
import { CreateVehicleRequest, TruckBodyType, TruckType, Vehicle } from "../types/vehicle";

export const getAllVehicles = async (): Promise<Vehicle[]> => {
    try {
      const response = await fetch(
        VEHICLE,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return (await response.json()) as Vehicle[];
    } catch (error: any) {
      console.error("Error fetching vehicles:", error.message);
      return [];
    }
  };

  export const getVehicleById = async (id: number): Promise<Vehicle | null> => {
    try {
      const response = await fetch(
        `${VEHICLE_BY_ID}/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return (await response.json()) as Vehicle;
    } catch (error: any) {
      console.error("Error fetching vehicle by ID:", error.message);
      return null;
    }
  };

  export const createVehicle = async (
    vehicleData: CreateVehicleRequest
  ): Promise<CreateVehicleRequest> => {
    try {
      const response = await fetch(
        CREATE_VEHICLE,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleData),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error("Error creating vehicle:", error.message);
      throw error;
    }
  };

  export const deleteVehicle = async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(
        `${DELETE_VEHICLE}/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        message: result?.message ?? "Vehicle deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting vehicle:", error.message);
      return { success: false, message: error.message };
    }
  };

  export const getTruckBodyTypes = async (): Promise<TruckBodyType[]> => {
    try {
      const response = await fetch(TRUCK_BODY_TYPE, {
        method: "GET",
        headers: {
          Accept: "*/*", 
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching truck body types:", error);
      throw error;
    }
  };

  export const getTruckTypes = async (): Promise<TruckType[]> => {
    try {
      const response = await fetch(TRUCK_TYPE, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching truck types:", error);
      throw error;
    }
  };