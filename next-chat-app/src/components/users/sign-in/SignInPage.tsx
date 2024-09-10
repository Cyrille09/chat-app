"use client";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { ImGoogle2 } from "react-icons/im";

// style components
import { GlobalButton } from "@/components/button/GlobalButton";
import { BoxShadowCard } from "@/components/cards";
import { signIn, updateUserProfile } from "@/services/usersServices";
import { loginForm } from "@/components/formValidation/formValidation";
import { LOCAL_STORAGE_USER_TOKEN } from "@/constants/defaultValues";
import { homePage, signUpPage } from "@/constants/routePath";
import { GlobalErrorMessage } from "@/components/errorAndSuccessMessage";

import "../users.scss";
import Link from "next/link";
import { Input } from "@/components/fields/input";
import { Toggle } from "@/components/fields/toggle";
import {
  errorPopupActions,
  isLoadingActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import { loginSuccess } from "@/redux-toolkit/reducers/authSlice";
import { LoadingData } from "@/components/loading/LoadingData";
import { socket } from "@/components/websocket/websocket";

export default function SignInPage() {
  const router = useRouter();
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  const dispatch = useDispatch();

  const loginData = async (values: { email: string; password: string }) => {
    dispatch(isLoadingActions(true));

    signIn(values.email.trim(), values.password)
      .then((response) => {
        const user = response.data;
        Cookies.set(LOCAL_STORAGE_USER_TOKEN, user.token, {});
        dispatch(loginSuccess({ token: user.token }));
        dispatch(isLoadingActions(false));
        updateUserProfileData();
        router.push(homePage);
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: "Invalid credential!",
            display: "",
          })
        );
      });
  };

  const updateUserProfileData = () => {
    const lastSeen = {
      status: true,
      date: new Date(),
    };
    updateUserProfile({ lastSeen })
      .then((response) => {
        socket.emit("userStatus", response.data);
      })
      .catch((error) => {});
  };

  const initialValues = {
    email: "",
    password: "",
    isEnabled: false,
  };

  return (
    <div className="usersMain">
      {actionsSlice.isLoading && <LoadingData />}

      <div className="container">
        <div className="content-sign-in">
          <div className="row">
            <div className="col-md-12">
              <BoxShadowCard>
                <div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={loginForm}
                    onSubmit={loginData}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                      values,
                      errors,
                    }) => (
                      <div className="sign-in-side">
                        <div className="row">
                          <div>
                            {actionsSlice.errorPopup.status && (
                              <>
                                <GlobalErrorMessage
                                  message={actionsSlice.errorPopup.message}
                                />
                              </>
                            )}
                          </div>
                          <div>
                            <p>
                              Not a Member?{" "}
                              <GlobalButton
                                format="none"
                                size="sm"
                                className="sign-up-member"
                                onClick={() => router.push(signUpPage)}
                              >
                                Sign up
                              </GlobalButton>
                            </p>
                          </div>
                          {/* <div style={{ marginBottom: 20 }}>
                            <div className="col-md-12 sign-in-side-input">
                              <GlobalButton
                                width="full-width"
                                format="secondary"
                                className="sso-sign-in"
                                style={{
                                  background: "#4285f4",
                                  textAlign: "left",
                                }}
                                leftIcon={<ImGoogle2 />}
                                onClick={() => handleSubmit()}
                              >
                                <i> Sign in with Google</i>
                              </GlobalButton>
                            </div>
                            <div className="col-md-12 sign-in-side-input">
                              <GlobalButton
                                width="full-width"
                                format="secondary"
                                className="sso-sign-in"
                                style={{
                                  background: "#1877f2",
                                  textAlign: "left",
                                }}
                                leftIcon={<FaFacebookSquare />}
                                onClick={() => handleSubmit()}
                              >
                                <i> Sign in with Facebook</i>
                              </GlobalButton>
                            </div>
                            <div className="col-md-12 sign-in-side-input">
                              <GlobalButton
                                width="full-width"
                                format="secondary"
                                className="sso-sign-in"
                                style={{
                                  background: "#0e76a8",
                                  textAlign: "left",
                                }}
                                leftIcon={<FaLinkedin />}
                                onClick={() => handleSubmit()}
                              >
                                <i> Sign in with LinkedIn</i>
                              </GlobalButton>
                            </div>
                            <div className="horizontal-line-container">
                              <div className="left-horizontal-line"></div>
                              <span>or</span>
                              <div className="right-horizontal-line"></div>
                            </div>
                          </div> */}

                          <div className="col-md-12 sign-in-side-input">
                            <Input
                              placeholder="Email"
                              name="email"
                              required
                              id="email"
                              label="Email"
                              type="email"
                              onBlur={handleBlur("email")}
                              autoCapitalize="none"
                              onChange={handleChange("email")}
                              error={errors.email}
                            />
                          </div>

                          <div className="col-md-12 sign-in-side-input">
                            <Input
                              type={values.isEnabled ? "text" : "password"}
                              placeholder="Password"
                              name="password"
                              required
                              id="password"
                              label="Password"
                              onBlur={handleBlur("password")}
                              autoCapitalize="none"
                              onChange={handleChange("password")}
                              error={errors.password}
                            />
                          </div>
                          <div className="col-md-12 sign-in-row">
                            <div className="flex-row">
                              <div className="flex-row-left-side">
                                <Toggle
                                  type="checkbox"
                                  name="isEnabled"
                                  id="isEnabled"
                                  labelClassName="sign-in-toggle"
                                  label={
                                    values.isEnabled
                                      ? "Hide Password!"
                                      : "Show Password!"
                                  }
                                  rightLabel
                                  onChange={(value: {
                                    target: { value: string };
                                  }) => {
                                    const targetValue =
                                      value.target &&
                                      value.target.value === "true"
                                        ? false
                                        : true;
                                    setFieldValue(`isEnabled`, targetValue);
                                  }}
                                />
                              </div>
                              <div className="sign-forgot-password flex-row-right-side">
                                <GlobalButton
                                  format="none"
                                  size="sm"
                                  onClick={() => alert("coming soon")}
                                >
                                  Forgot password?
                                </GlobalButton>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-12 sign-in-button">
                            <GlobalButton
                              width="full-width"
                              format="secondary"
                              onClick={() => handleSubmit()}
                            >
                              Sign in
                            </GlobalButton>
                          </div>
                        </div>
                      </div>
                    )}
                  </Formik>
                </div>
              </BoxShadowCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
