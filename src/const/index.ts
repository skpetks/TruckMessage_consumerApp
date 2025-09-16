export const BASE_URL = 'http://13.203.183.224/api';

//Auth
export const AUTH_CHECK_MOBILE = `${BASE_URL}/User/check-mobile`;
export const User_Register = `${BASE_URL}/User/register`;
export const User_Send_Otp = `${BASE_URL}/User/send-otp`;
export const User_Login_Otp = `${BASE_URL}/User/login-otp`;

//Common
export const Get_States = `${BASE_URL}/State/list`;
export const Get_Cities = `${BASE_URL}/City/list`;

//Marketplace
export const GET_MARKETPLACE_LIST = `${BASE_URL}/Dashboard/getMarketPlaceList`;

//Post
//Load Availability
export const GET_LOAD_AVAILABILITY = `${BASE_URL}/LoadAvalibility/list`;
export const SAVE_LOAD_AVAILABILITY = `${BASE_URL}/LoadAvalibility/save`;
export const GET_LOAD_AVAILABILITY_BY_ID = `${BASE_URL}/LoadAvalibility`;

//Driver Availability
export const DRIVER_AVAILABILITY = `${BASE_URL}/DriverAvailability`;

//Trip Detail Load
export const TRIP_DETAIL_LOAD = `${BASE_URL}/TripDetailLoad`;
export const SAVE_TRIP_DETAIL_LOAD = `${BASE_URL}/TripDetailLoad/createOrUpdate`;

//Vehicle
export const VEHICLE = `${BASE_URL}/Vehicle/getAll`;
export const VEHICLE_BY_ID = `${BASE_URL}/Vehicle/get`;
export const CREATE_VEHICLE = `${BASE_URL}/Vehicle/create`;
export const DELETE_VEHICLE = `${BASE_URL}/Vehicle/delete`;
export const TRUCK_BODY_TYPE = `${BASE_URL}/TruckBodyType/list`;
export const TRUCK_TYPE = `${BASE_URL}/TruckType`;