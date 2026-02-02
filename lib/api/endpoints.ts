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
  },
  ADMIN: {
    USERS: "/api/admin/users",
    USER_BY_ID: (userId: string) => `/api/admin/users/id/${userId}`,
    USER_BY_PHONE: (phoneNumber: string) =>
      `/api/admin/users/phone/${phoneNumber}`,

  },
};
export const UPLOADS = {
  PROFILE_IMAGE_DIR: "/uploads/profile-pictures",
};