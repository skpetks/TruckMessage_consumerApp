import { GET_LOAD_AVAILABILITY, GET_LOAD_AVAILABILITY_BY_ID, SAVE_LOAD_AVAILABILITY } from "../const";
import { LoadAvailabilityType } from "../types/LoadAvailability";


export const getLoadAvailabilities = async (): Promise<LoadAvailabilityType[]> => {
    try {
      const response = await fetch(GET_LOAD_AVAILABILITY,
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
  
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      console.error("Error fetching load availabilities:", error.message);
      throw error;
    }
  };

export const saveLoadAvailability = async (data: any) => {
    try {
      const response = await fetch(SAVE_LOAD_AVAILABILITY, {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error("Error saving load availability:", error.message);
      throw error;
    }
  };

  export const getLoadAvailabilityById = async (
    id: number
  ): Promise<LoadAvailabilityType | null> => {
    try {
      const response = await fetch(
        `${GET_LOAD_AVAILABILITY_BY_ID}/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "text/plain",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const text = await response.text();
  
      try {
        return JSON.parse(text) as LoadAvailabilityType;
      } catch {
        console.warn("Response is not valid JSON:", text);
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching load availability:", error.message);
      throw error;
    }
  };