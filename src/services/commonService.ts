import { Get_Cities, Get_States } from "../const";

export const fetchStates = async () => {
    try {
      const response = await fetch( Get_States, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Error (fetchStates):", error);
      throw error;
    }
  };

export const fetchCities = async () => {
    try {
      const response = await fetch(Get_Cities, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Error (fetchCities):", error);
      throw error;
    }
  };