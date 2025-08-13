import { User_Register } from "../const";
import { RegisterPayload } from "../types/Register";

export async function registerUser(payload: RegisterPayload) {
    try {
      const response = await fetch(User_Register, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${response.status}: ${JSON.stringify(errorData)}`
        );
      }
  
      return await response.json();
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  }