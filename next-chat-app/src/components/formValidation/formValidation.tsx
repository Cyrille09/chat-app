import * as yup from "yup";
import parsePhoneNumber from "libphonenumber-js";

const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;
const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const urlRegExp =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

const validatePhoneNumber = (value: any) => {
  try {
    if (!value) return true;
    const phoneNumber = parsePhoneNumber(value);
    return phoneNumber && phoneNumber.isValid();
  } catch (error) {
    return false;
  }
};

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
 * change password form validation
 */
export const changePasswordForm = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

/**
 * subscription form validation
 */
export const subscriptionForm = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(emailRegExp, "Invalid email address!"),
});

/**
 * update user profile form validation
 */
export const editUserProfileForm = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(emailRegExp, "Invalid email address!"),
  gender: yup.string().required("Gender is required"),
  tel: yup
    .string()
    .matches(phoneRegExp, "Invalid phone number")
    .test("isValidPhoneNumber", "Invalid phone number!", validatePhoneNumber),

  mobilePhone: yup
    .string()
    .matches(phoneRegExp, "Invalid mobile number")
    .test("isValidPhoneNumber", "Invalid phone number!", validatePhoneNumber),

  linkedIn: yup.string().matches(urlRegExp, "Invalid linkedIn link"),
  website: yup.string().matches(urlRegExp, "Invalid website link"),
  youtubeLink: yup.string().matches(urlRegExp, "Invalid youTube link"),
  country: yup.string().when("value", (value: any) => {
    return value === process.env.lawyerRoleId
      ? yup.string().required("Country is required")
      : yup.string();
  }),
  county: yup.string().when("value", (value: any) => {
    return value === process.env.lawyerRoleId
      ? yup.string().required("County is required")
      : yup.string();
  }),
  city: yup.string().when("value", (value: any) => {
    return value === process.env.lawyerRoleId
      ? yup.string().required("City is required")
      : yup.string();
  }),
  address: yup.string().when("value", (value: any) => {
    return value === process.env.lawyerRoleId
      ? yup.string().required("Address is required")
      : yup.string();
  }),
  postCode: yup.string().when("value", (value: any) => {
    return value === process.env.lawyerRoleId
      ? yup.string().required("Post code is required")
      : yup.string();
  }),
});

/**
 * reason for cancelling form validation
 */
export const textAreaMessageForm = yup.object().shape({
  textAreaMessage: yup.string().required("Message is required"),
});

export const documentBankForm = yup.object().shape({
  name: yup.string().required("Document bank name is required"),
  subCategory: yup.string().required("Sub category is required"),
  editStatus: yup.string(),
  document: yup
    .string()
    .when(["editStatus"], (editStatus: any, schema: any) => {
      return editStatus[0] === "true"
        ? schema
        : schema.required("File is required");
    }),
  packagePlan: yup.string().required("Plan is required"),
  price: yup
    .number()
    .nullable()
    .when(["packagePlan"], (packagePlan: any, schema: any) => {
      return packagePlan[0] === "free"
        ? schema
            .lessThan(0, "Price must be empty when the plan is FREE")
            .moreThan(0, "Price must be empty when the plan is FREE")
        : // .transform(() => null)
          schema
            .typeError("Price must be a number")
            .required("Price is required when the plan is PRO or BUSINESS");
    }),
  country: yup.string().required("Country is required"),
  description: yup.string().required("Description is required"),
});

export const categoryForm = yup.object().shape({
  name: yup.string().required("Category is required"),
});

export const roleForm = yup.object().shape({
  name: yup.string().required("Role is required"),
});

export const areaOfLawForm = yup.object().shape({
  name: yup.string().required("Area of law is required"),
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
  oldPassword: yup.string().required("Old password is required"),
  password: yup.string().required("New password is required"),
});
