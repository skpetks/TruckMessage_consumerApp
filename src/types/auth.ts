export interface CheckMobileResponse {
    exists: boolean;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    userCode: string;
    mobileNumber: string;
    email: string;
    city: string;
    pincode: string;
    state: string;
    address: string;
    gender: string;
    photo: string;
    dateOfBirth: string;
    adharCardNumber: string;
    organizationID: number;
    roleID: number;
    token?: string;
    refreshToken?: string;
}

export interface LoginPayload {
    mobileNumber: string;
    otp: string; // Changed from password to otp
    deviceType: string;
    deviceToken: string;
    loginType: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user: User;
    token: string;
    refreshToken: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}