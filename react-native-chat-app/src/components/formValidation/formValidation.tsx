import * as yup from "yup";

const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

/**
 * contact form validation
 */
export const contactForm = yup.object().shape({
  name: yup.string().required("Name is required"),
  number: yup.string().required("Phone Number is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(emailRegExp, "Invalid email address!"),
});

// ----------------------------------------
export const addContactForm = yup.object().shape({
  userId: yup.string().required("User is required"),
});

export const updateNameForm = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export const updateMessageForm = yup.object().shape({
  message: yup.string().required("Message is required"),
});

/**
 * change password form validation
 */
export const changeUserProfilePasswordForm = yup.object().shape({
  oldPassword: yup.string().required("Current password is required"),
  password: yup.string().required("New password is required"),
});

/**
 * sign up form validation
 */
export const signupForm = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(emailRegExp, "Invalid email address!"),
  password: yup.string().required("Password is required"),
});

/**
 * forgot password form validation
 */
export const forgotPasswordForm = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(emailRegExp, "Invalid email address!"),
});

/**
 * login form validation
 */
export const loginForm = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(emailRegExp, "Invalid email address!"),
  password: yup.string().required("Password is required"),
});
