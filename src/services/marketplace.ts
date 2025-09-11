import { GET_MARKETPLACE_LIST } from "../const";

export const getMarketPlaceList = async (): Promise<any> => {
    try {
      const response = await fetch(GET_MARKETPLACE_LIST, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), 
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.data || data; // Handle both wrapped and unwrapped responses
    } catch (error) {
      console.error("Error fetching marketplace list:", error);
      throw error;
    }
  };