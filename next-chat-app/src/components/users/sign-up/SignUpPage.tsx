"use client";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Col, Row } from "react-bootstrap";

// style components
import { GlobalButton } from "@/components/button/GlobalButton";
import { BoxShadowCard } from "@/components/cards";
import { addUser, updateUserProfile } from "@/services/usersServices";
import { signupForm } from "@/components/formValidation/formValidation";
import { homePage, signInPage } from "@/constants/routePath";
import { LOCAL_STORAGE_USER_TOKEN } from "@/constants/defaultValues";
import { GlobalErrorMessage } from "@/components/errorAndSuccessMessage";
import { ACTIONS_ERROR_MESSAGE } from "@/constants/globalText";

import "../users.scss";
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

export default function SignUpPage() {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const router = useRouter();
  const dispatch = useDispatch();

  const signUpData = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    dispatch(isLoadingActions(true));
    addUser(values.name.trim(), values.email.trim(), values.password)
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
            message: ACTIONS_ERROR_MESSAGE,
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
    name: "",
    email: "",
    password: "",
    isEnabled: false,
  };

  return (
    <div className="usersMain">
      {actionsSlice.isLoading && <LoadingData />}
      <div className="container">
        <div className="content-sign-up">
          <div className="row">
            <div className="col-md-12">
              <BoxShadowCard>
                <div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={signupForm}
                    onSubmit={signUpData}
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
                            <p>
                              Already a Member?{" "}
                              <GlobalButton
                                format="none"
                                size="sm"
                                className="sign-up-member"
                                onClick={() => router.push(signInPage)}
                              >
                                Sign in
                              </GlobalButton>
                            </p>
                          </div>
                          <div className="col-md-12">
                            {actionsSlice.errorPopup.status && (
                              <>
                                <GlobalErrorMessage
                                  message={actionsSlice.errorPopup.message}
                                />
                              </>
                            )}
                          </div>
                          <div className="col-md-12 sign-in-side-input">
                            <Input
                              placeholder="Name"
                              name="name"
                              required
                              id="name"
                              label="Name"
                              onBlur={handleBlur("name")}
                              autoCapitalize="none"
                              onChange={handleChange("name")}
                              error={errors.name}
                            />
                          </div>

                          <div className="col-md-12 sign-in-side-input">
                            <Input
                              placeholder="Email"
                              name="email"
                              required
                              id="email"
                              label="Email"
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

                          <div className="col-md-12 sign-up-row">
                            <Row>
                              <Col xs={6}>
                                <Toggle
                                  type="checkbox"
                                  name="isEnabled"
                                  id="isEnabled"
                                  label={
                                    values.isEnabled
                                      ? "Hide Password"
                                      : "Show Password"
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
                              </Col>

                              <Col xs={6} className="sign-up-button">
                                <GlobalButton
                                  format="secondary"
                                  onClick={() => handleSubmit()}
                                >
                                  Sign up
                                </GlobalButton>
                              </Col>
                            </Row>
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
