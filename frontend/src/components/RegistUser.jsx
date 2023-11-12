import React, { useState } from 'react';

export const RegistUser = () => {
		const [regist_user, setRegistUser] = useState('');
		const [pin, setPin] = useState('');

		const handleRegistUserChange = (event) => {
			setRegistUser(event.target.value);
		};
		const handlePinChange = (event) => {
			setPin(event.target.value);
		};

		const handleRegist = async (event) => {
			event.preventDefault();

			if (regist_user.trim() === '') {
				alert('フィールドを入力してください。');
			} else {

			try {
				const response = await fetch('http://localhost:3001/registUser', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						regist_user: regist_user,
						regist_pin: pin
					}),
				});
			if (response.ok) {
				const res = await response.json(); // サーバーサイドからのJSONデータを受信
				console.log('Server response:', res);

				alert(res.message);
			} else {
				const res = await response.json(); // サーバーサイドからのJSONデータを受信
				console.log('Server response:', res);

				alert(res.message);
			}
			} catch (error) {
				console.error('Error:', error);
				alert(`${error}\nPls check status-code`);
			}
		};
	}
	
	const isRegistFormValid = (regist_user.trim() !== '' && pin.trim() !== '' && isValidPin(pin));

	function isValidPin(pin) {
		const pinPattern = /^[0-9]{4}$/;
		return pinPattern.test(pin);
	}

	return (
		<div class="p-2 bg-white rounded-b-xl shadow-lg">
			<div className='flex flex-col items-center'>
			<p className='font-bold border-b border-gray-800'>REGIST USER</p>
				<form onSubmit={handleRegist} className='pt-4 flex flex-col place-items-center'>
				<label>
					<span>USER_NAME</span>
					<input type="regist_user" value={regist_user} onChange={handleRegistUserChange} 
					className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter name"/>
				</label>
				<label>
					<span>PIN</span>
					<input type="pin" value={pin} onChange={handlePinChange} maxLength={4} pattern="[0-9]{4}"
					className="flex place-items-center p border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter 4 numbers"/>
				</label>
					<div className='pt-4 pb-2'>
						<button type="regist" disabled={!isRegistFormValid} maxLength={4} pattern="[0-9]{4}" 
						className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">regist</button>
					</div>
				</form>
			</div>
		</div>
	);
}