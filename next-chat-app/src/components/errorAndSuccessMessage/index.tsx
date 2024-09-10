"use client";

import {
  errorPopupActions,
  successPopupActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/redux-toolkit/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import styles from "./errorAndSuccessMessage.module.scss";

export const GlobalErrorMessage = ({ message }: { message: string }) => {
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  const actions = useSelector((state: RootState) => state.actionsSlice);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(errorPopupActions({ status: false, message: "", display: "" }));
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  return (
    <CSSTransition
      in={actions.errorPopup.status}
      nodeRef={nodeRef}
      timeout={100}
      classNames="panel-animate"
      unmountOnExit={true}
      mountOnEnter={true}
      onEnter={() => document.body.classList.add("css-transition-modal-open")}
      onExited={() =>
        document.body.classList.remove("css-transition-modal-open")
      }
    >
      <div className={styles.message} role="alert">
        {message}
      </div>
    </CSSTransition>
  );
};

export const GlobalSuccessMessage = ({ message }: { message: string }) => {
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  const actions = useSelector((state: RootState) => state.actionsSlice);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        successPopupActions({ status: false, message: "", display: "" })
      );
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  return (
    <CSSTransition
      in={actions.successPopup.status}
      nodeRef={nodeRef}
      timeout={100}
      classNames="panel-animate"
      unmountOnExit={true}
      mountOnEnter={true}
      onEnter={() => document.body.classList.add("css-transition-modal-open")}
      onExited={() =>
        document.body.classList.remove("css-transition-modal-open")
      }
    >
      <div className={styles.successMessage} role="alert">
        {message}
      </div>
    </CSSTransition>
  );
};
