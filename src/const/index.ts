export const BASE_URL = 'http://49.204.232.32:2500/api';

//Auth
export const AUTH_CHECK_MOBILE = `${BASE_URL}/User/check-mobile`;
export const User_Register = `${BASE_URL}/User/register`;
export const User_Send_Otp = `${BASE_URL}/User/send-otp`;
export const User_Login_Otp = `${BASE_URL}/User/login-otp`;

//Common
export const Get_States = `${BASE_URL}/State/list`;
export const Get_Cities = `${BASE_URL}/City/list`;