import React from 'react';
import LoginForm from "./components/loginForm/LoginForm";
import CatchError from "./components/CatchError";

const Task01 = ({ tryAuth }) => {
  return (
    <section>
      <h1>Task01</h1>
      <CatchError>
        <LoginForm tryAuth={tryAuth} />
      </CatchError>
    </section>
  );
};

export default Task01;
