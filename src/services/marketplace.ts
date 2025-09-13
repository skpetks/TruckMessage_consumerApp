import { GET_MARKETPLACE_LIST } from "../const";

export const getMarketPlaceList = async (keyword: string, filterType: number): Promise<any> => {
  try {
    console.log('Keyword:', keyword);
    console.log('Filter Type:', filterType);
    const response = await fetch(`${GET_MARKETPLACE_LIST}?keyword=${keyword}&filterType=${filterType}`, {
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