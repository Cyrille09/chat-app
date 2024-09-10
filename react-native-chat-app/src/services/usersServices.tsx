import axiosInterceptors from "../lib/axiosInterceptors";

/**
 * Add user service
 */
export async function addUser(name: string, email: string, password: string) {
  const response = await axiosInterceptors.post(`/users/`, {
    name: name,
    email: email,
    password: password,
  });

  return response;
}

/**
 * View users service
 */
export async function getUsers(
  token: string,
  query: { status: string; role: string; filter: string; page: number }
) {
  return await axiosInterceptors.get(`/users`, {
    tokenFromServer: token,
    ...query,
  });
}

export async function viewUsersBilling(filter: string) {
  return await axiosInterceptors.get(`/users/billing/${filter}`, {});
}
export async function getUsersBillingCount(token: string) {
  return await axiosInterceptors.get(`/users/billingCount`, {
    tokenFromServer: token,
  });
}
export async function viewUsersBillingCancelledCount() {
  return await axiosInterceptors.get(`/users/billingCancelledCount`, {});
}

export async function getUsersAnnualChart(token: string) {
  return await axiosInterceptors.get(`/users/annualChart`, {
    tokenFromServer: token,
  });
}

export async function countUser(token: string) {
  return await axiosInterceptors.get(`/users/count`, {
    tokenFromServer: token,
  });
}
/**
 * View each user service
 */
export async function getUser(id: string, token?: string) {
  return await axiosInterceptors.get(`/users/${id}`, {
    tokenFromServer: token,
  });
}

export async function checkForgotPasswordConfirm(
  email: string,
  validationCode: string
) {
  return await axiosInterceptors.get(
    `/users/validation/${email}/${validationCode}/`,
    {}
  );
}

/**
 * Get user profile service
 */
export async function getUserProfile() {
  return await axiosInterceptors.get(`/users/me`, {});
}

export async function viewImage() {
  return await axiosInterceptors.get(`/users/image/me/`, {});
}

export async function updateUserProfile(userDetail: {}) {
  return await axiosInterceptors.patch(`/users/me`, {
    ...userDetail,
  });
}

/**
 * Update user service
 */
export async function updateUser(userDetail: {}, id: string) {
  return await axiosInterceptors.put(`/users/${id}`, {
    userDetail,
  });
}

export async function updateUserProfileImage(data: {}) {
  return await axiosInterceptors.put(`/users/photo/me/`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

/**
 * Login service
 */
export async function signIn(email: string, password: string) {
  const response = await axiosInterceptors.post("/users/login/", {
    email: email,
    password: password,
  });

  return response;
}

/**
 * Change password service
 */

export async function sendEmail(
  email: string,
  validationCode: string,
  validationCodeDate: string
) {
  return await axiosInterceptors.post(`/users/sendEmail`, {
    email: email,
    validationCode: validationCode,
    validationCodeDate: validationCodeDate,
  });
}

export async function resetPassword(
  email: string,
  validationCode: string,
  password: string
) {
  return await axiosInterceptors.post(`/users/changeForgotPassword`, {
    email: email,
    validationCode: validationCode,
    password: password,
  });
}
/**
 * change user profile password service
 */
export async function changeUserProfilePassword(
  oldPassword: string,
  newPassword: string
) {
  return await axiosInterceptors.post(`/users/changeUserProfilePassword`, {
    oldPassword: oldPassword,
    password: newPassword,
  });
}

export async function changePasswordByUser(password: string, id: string) {
  return await axiosInterceptors.post(`/users/changeUserPassword/${id}`, {
    password: password,
  });
}

/**
 * Logout userservice
 */
export async function logout() {
  return await axiosInterceptors.post(`/users/logout`, {});
}

/**
 * Delete user service
 */
export async function deleteUser(id: string) {
  return await axiosInterceptors.remove(`/users/${id}`, {});
}

export async function deleteUserProfile() {
  return await axiosInterceptors.remove(`/users/profile/me`, {});
}

export async function deleteUserPhoto() {
  return await axiosInterceptors.remove(`/users/photo/me`);
}

export function withUser(callback: any) {
  return async function (ctx: { token: string }) {
    let user = null;
    try {
      user = await axiosInterceptors.get(`/users/me/`, {
        tokenFromServer: ctx.token,
      });
      return callback(ctx, user);
    } catch (error) {
      return callback(ctx, user);
    }
  };
}

export function withAuthentication(callback: any) {
  return async function (ctx: { token: string; resolvedUrl: string }) {
    let user = null;
    try {
      user = await axiosInterceptors.get(`/users/me/`, {
        tokenFromServer: ctx.token,
      });
      if (!user) {
        return {
          redirect: {
            permanent: false,
            destination: `/users/sign-in?redirectTo=${ctx.resolvedUrl}`,
          },
        };
      }
      return callback(ctx, user);
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: `/users/sign-in?redirectTo=${ctx.resolvedUrl}`,
        },
      };
    }
  };
}
