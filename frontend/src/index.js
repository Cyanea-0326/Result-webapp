import React from 'react';
import ReactDOM from 'react-dom';

import { RegistUser } from "./components/RegistUser";
import { InputForm } from "./components/InputForm";
import { ExitUser } from "./components/ExitUser";
import { RenderingTx } from "./components/RenderingTx";
import { EditTx } from "./components/EditTx";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RegistUser />
      <br/>
    <InputForm />
      <br/>
    <ExitUser />
      <br/>
    <RenderingTx />
      <br/>
    <EditTx />
  </React.StrictMode>
);
