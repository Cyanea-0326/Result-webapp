// import React from "react";
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
				console.error('Failed to regist');
			}
			} catch (error) {
				console.error('Error:', error);
			}
		};
	}
	
	const isRegistFormValid = (regist_user.trim() !== '' && pin.trim() !== '' && isValidPin(pin));

	function isValidPin(pin) {
		const pinPattern = /^[0-9]{4}$/;
		return pinPattern.test(pin);
	}

	return (
		<div>
			<form onSubmit={handleRegist}>
			<label>
				regist_user :
				<input type="regist_user" value={regist_user} onChange={handleRegistUserChange} />
			</label>
				<br/>
			<label>
				regist_pin :
				<input type="pin" value={pin} onChange={handlePinChange} />
				<br/>
				<button type="regist" disabled={!isRegistFormValid} maxLength={4} pattern="[0-9]{4}">regist</button>
			</label>
			</form>
		</div>
	);
}