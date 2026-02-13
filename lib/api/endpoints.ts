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
  },
};
export const UPLOADS = {
  PROFILE_IMAGE_DIR: "/uploads/profile-pictures",
};
