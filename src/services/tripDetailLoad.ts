import { TRIP_DETAIL_LOAD } from "../const";
import { TripDetailLoad, TripDetailLoadPayload } from "../types/tripDetailLoad";

export const getTripDetailLoads = async (): Promise<TripDetailLoad[]> => {
    try {
      const response = await fetch(
        TRIP_DETAIL_LOAD,
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
  
      return (await response.json()) as TripDetailLoad[];
    } catch (error: any) {
      console.error("Error fetching trip detail loads:", error.message);
      return [];
    }
  };

  export const saveTripDetailLoad = async (
    payload: TripDetailLoadPayload
  ) => {
    try {
      const response = await fetch(
        TRIP_DETAIL_LOAD,
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
  
      return (await response.json()) as TripDetailLoadPayload;
    } catch (error: any) {
      console.error("Error saving trip detail load:", error.message);
      throw error;
    }
  };


export const getTripDetailLoadById = async (
    id: number
  ): Promise<TripDetailLoad | null> => {
    try {
      const response = await fetch(
        `${TRIP_DETAIL_LOAD}/${id}`,
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
  
      return (await response.json()) as TripDetailLoad;
    } catch (error: any) {
      console.error("Error fetching TripDetailLoad by ID:", error.message);
      return null;
    }
  };

  export const deleteTripDetailLoad = async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(
        `${TRIP_DETAIL_LOAD}/${id}`,
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
      console.error("Error deleting TripDetailLoad:", error.message);
      return { success: false, message: error.message };
    }
  };