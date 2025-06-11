export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]*$/;

// export const BACKEND_URI = 'https://6sense-efficiency-backend.vercel.app';

// export const TEMP_BACKEND_URI = "https://sure-nady-6sensehq-125ac33a.koyeb.app"
export const TEMP_BACKEND_URI = process.env.NEXT_PUBLIC_TEMP_BACKEND_URI as string;
