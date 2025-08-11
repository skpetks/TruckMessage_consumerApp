import { AUTH_CHECK_MOBILE } from "../const";
import { CheckMobileResponse } from "../types/auth";

export const checkMobile = async (mobileNumber: string): Promise<CheckMobileResponse> => {
    try {
      const response = await fetch(AUTH_CHECK_MOBILE, {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: CheckMobileResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking mobile:', error);
      throw error;
    }
  }