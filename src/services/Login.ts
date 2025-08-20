import { AUTH_CHECK_MOBILE, User_Login_Otp, User_Send_Otp } from "../const";
import { CheckMobileResponse, LoginPayload, LoginResponse } from "../types/auth";

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

  export const sendOtp = async (mobileNumber: string) => {
    try {
      const response = await fetch(User_Send_Otp, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("OTP sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Send OTP failed:", error);
      throw error;
    }
  };

export const loginWithOtp = async (loginData: LoginPayload): Promise<LoginResponse> => {
    try {
      const response = await fetch(User_Login_Otp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }