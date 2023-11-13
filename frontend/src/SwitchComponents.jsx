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
		<div className="bg-gray-100">
			<div className='p-10 max-w-xl mx-auto bg-gray-100 rounded-xl'>
				<div className='flex justify-between'>
					<button onClick={() => handleShowfuncChange('RegistUser')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>REGIST</button>
					<button onClick={() => handleShowfuncChange('InputForm')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>ADD</button>
					<button onClick={() => handleShowfuncChange('ExitUser')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>EXIT</button>
					<button onClick={() => handleShowfuncChange('RenderingTx')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>SHOW</button>
					<button onClick={() => handleShowfuncChange('EditTx')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>EDIT</button>
				</div>

				{showfunc === 'RegistUser' && <RegistUser />}
				{showfunc === 'InputForm' && <InputForm />}
				{showfunc === 'ExitUser' && <ExitUser />}
				{showfunc === 'RenderingTx' && <RenderingTx />}
				{showfunc === 'EditTx' && <EditTx />}
			</div>
		</div>
	)
}