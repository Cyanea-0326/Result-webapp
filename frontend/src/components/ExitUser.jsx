import React, { useState } from 'react';

export const ExitUser = () => {
		const [user, setUser] = useState('');
		const [pin, setPin] = useState('');

		const handleUserChange = (event) => {
			setUser(event.target.value);
		};
		const handlePinChange = (event) => {
			setPin(event.target.value);
		};

		const handleRegist = async (event) => {
			event.preventDefault();

			try {
				const response = await fetch('http://localhost:3001/exitUser', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user: user,
						auth_pin: pin
					}),
				});

			if (response.ok) {
				const res = await response.json();
				console.log('Server response:', res);
				
				alert(res.message);
			} else {
				const res = await response.json();
				console.log('Server response:', res);
				
				alert(res.message);
			}
			} catch (error) {
				console.error('Error:', error);
				alert(`${error}\nPls check status-code`);
			}
		};
	
	const isRegistFormValid = (user.trim() !== '' && pin.trim() !== '' && isValidPin(pin));

	function isValidPin(pin) {
		const pinPattern = /^[0-9]{4}$/;
		return pinPattern.test(pin);
	}

	return (
		<div class="p-2 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4">
			<div className='flex flex-col items-center'>
			<p className='font-bold border-b border-gray-800'>DELETE USER</p>
			<form onSubmit={handleRegist} className='pt-4 flex flex-col place-items-center'>
			<label>
				<span>USER</span>
				<input type="user" value={user} onChange={handleUserChange} 
				className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				placeholder="Enter name"/>
			</label>
			<label>
				<span>PIN</span>
				<input type="pin" value={pin} onChange={handlePinChange} 
				className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				placeholder="Enter PIN"/>
			</label>
				<div className='pt-4 pb-2'>
					<button type="regist" disabled={!isRegistFormValid} maxLength={4} pattern="[0-9]{4}" 
					className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">delete</button>
				</div>
			</form>	
			</div>
		</div>
	);
}