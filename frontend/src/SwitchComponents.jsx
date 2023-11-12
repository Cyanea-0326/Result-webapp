import React, { useState } from 'react';

import { RegistUser } from "./components/RegistUser";
import { InputForm } from "./components/InputForm";
import { ExitUser } from "./components/ExitUser";
import { RenderingTx } from "./components/RenderingTx";
import { EditTx } from "./components/EditTx";

import './input.css';

export const SwitchComponents = () => {
	const [showfunc, setShowFunc] = useState('RegistUser');
	
	const handleShowfuncChange = (component) => {
		setShowFunc(component);
	}

	return (
		<div>
			<button onClick={() => handleShowfuncChange('RegistUser')} className=''>REGIST</button>
			<br/>
			<button onClick={() => handleShowfuncChange('InputForm')}>ADD</button>
			<br/>
			<button onClick={() => handleShowfuncChange('ExitUser')}>EXIT</button>
			<br/>
			<button onClick={() => handleShowfuncChange('RenderingTx')}>SHOW</button>
			<br/>
			<button onClick={() => handleShowfuncChange('EditTx')}>EDIT</button>

			{showfunc === 'RegistUser' && <RegistUser />}
			{showfunc === 'InputForm' && <InputForm />}
			{showfunc === 'ExitUser' && <ExitUser />}
			{showfunc === 'RenderingTx' && <RenderingTx />}
			{showfunc === 'EditTx' && <EditTx />}
		</div>
	)
}