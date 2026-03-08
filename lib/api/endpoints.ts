// backend route paths

// export const API={
//     USER:{
//         REGISTER:"/api/user/register",
//         LOGIN:"/api/user/login",

//     }
// }

export const API = {
  USER: {
    REGISTER: "/api/user/register",
    LOGIN: "/api/user/login",
    ME: "/api/user/me",
    EDIT_ME: "/api/user/me",
    USERS_PUBLIC: "/api/user/users",
    REQUEST_PASSWORD_RESET: "/api/user/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/user/reset-password/${token}`,
  },
  ADMIN: {
    USERS: "/api/admin/users",
    USER_BY_ID: (userId: string) => `/api/admin/users/id/${userId}`,
    USER_BY_PHONE: (phoneNumber: string) =>
      `/api/admin/users/phone/${phoneNumber}`,
    EDIT_USER: (userId: string) => `/api/admin/users/edit/${userId}`,
    DELETE_ONE_USER: (userId: string) => `/api/admin/users/delete/${userId}`,
    DELETE_ALL_USERS: "/api/admin/users/deleteAll",
    APPROVE_BUSINESS: (businessId: string) =>
      `/api/admin/approve-business/${businessId}`,
  },
  BUSINESS: {
    REGISTER: "/api/business/register",
    LOGIN: "/api/business/login",
    UPLOAD_DOCUMENT: "/api/business/upload-document",
    PROFILE: "/api/business/profile",
    EDIT_PROFILE: "/api/business/profile/edit",
    ADMIN_ALL: "/api/business/admin/all",
    ADMIN_APPROVE: (businessId: string) => `/api/business/admin/approve/${businessId}`,
  },
  BOOKING: {
    CREATE: "/api/booking/create",
    MINE: "/api/booking/mine",
    BY_REF: (ref: string) => `/api/booking/ref/${ref}`,
    BY_ID: (id: string) => `/api/booking/${id}`,
    CANCEL: (id: string) => `/api/booking/cancel/${id}`,
  },
  WALLET: {
    USER_BALANCE: "/api/wallet/balance",
    USER_TRANSACTIONS: "/api/wallet/transactions",
    BUSINESS_BALANCE: "/api/wallet/business/balance",
    BUSINESS_TRANSACTIONS: "/api/wallet/business/transactions",
  },
  TICKET: {
    BY_ID: (id: string) => `/api/ticket/${id}`,
    BY_BOOKING: (bookingId: string) => `/api/ticket/booking/${bookingId}`,
    SCAN: "/api/ticket/scan",
    VOID: (id: string) => `/api/ticket/void/${id}`,
  },
  TRIP: {
    SEARCH: "/api/trip/search",
    BY_ID: (id: string) => `/api/trip/${id}`,
    CREATE: "/api/trip/create",
    BUSINESS_MINE: "/api/trip/business/mine",
    EDIT: (id: string) => `/api/trip/edit/${id}`,
    DELETE: (id: string) => `/api/trip/delete/${id}`,
  },
};
export const UPLOADS = {
  PROFILE_IMAGE_DIR: "/uploads/profile-pictures",
};
