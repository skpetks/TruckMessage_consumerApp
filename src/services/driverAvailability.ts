import { DRIVER_AVAILABILITY } from "../const";
import { DriverAvailability, DriverAvailabilityType } from "../types/DriverAvailability";

export const getDriverAvailability = async (): Promise<DriverAvailability[]> => {
    try {
      const response = await fetch(DRIVER_AVAILABILITY,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const text = await response.text();
      try {
        return JSON.parse(text) as DriverAvailability[];
      } catch {
        console.warn("Response is not valid JSON:", text);
        return [] as DriverAvailability[];
      }
    } catch (error: any) {
      console.error("Error fetching driver availabilities:", error.message);
      throw error;
    }
  };

  export const saveDriverAvailability = async (
    payload: DriverAvailabilityType
  ): Promise<DriverAvailabilityType> => {
    try {
      const response = await fetch(DRIVER_AVAILABILITY,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error("Error saving driver availability:", error.message);
      throw error;
    }
  };

  export const getDriverAvailabilityById = async (
    id: number
  ): Promise<DriverAvailability | null> => {
    try {
      const response = await fetch(
        `${DRIVER_AVAILABILITY}/${id}`,
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
  
      return (await response.json()) as DriverAvailability;
    } catch (error: any) {
      console.error("Error fetching driver availability:", error.message);
      return null;
    }
  };

  export const deleteDriverAvailability = async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(
        `${DRIVER_AVAILABILITY}/${id}`,
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
      return { success: true, message: result?.message ?? "Deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting driver availability:", error.message);
      return { success: false, message: error.message };
    }
  };