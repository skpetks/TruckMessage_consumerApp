import { GET_MARKETPLACE_LIST } from "../const";

export const getMarketPlaceList = async (filterType: number = 0): Promise<any> => {
  try {
    const response = await fetch(`${GET_MARKETPLACE_LIST}?filterType=${filterType}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: "",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Marketplace list:', data);
    return data.data;
  } catch (error) {
    console.error("Error fetching marketplace list:", error);
    throw error;
  }
};