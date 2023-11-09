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

			if (user.trim() === '') {
				alert('フィールドを入力してください。');
			} else {

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
				console.log('delete successfully');
				//　ここでres.send();を表示したい
				alert('Account info has been deleted :)');
			} else {
				console.error('Failed to regist');
			}
			} catch (error) {
				console.error('Error:', error);
			}
		};
	}
	
	const isRegistFormValid = (user.trim() !== '' && pin.trim() !== '' && isValidPin(pin));

	function isValidPin(pin) {
		const pinPattern = /^[0-9]{4}$/;
		return pinPattern.test(pin);
	}

	return (
		<div>
			<form onSubmit={handleRegist}>
			<label>
				user :
				<input type="user" value={user} onChange={handleUserChange} />
			</label>
				<br/>
			<label>
				PIN :
				<input type="pin" value={pin} onChange={handlePinChange} />
				<br/>
				<button type="regist" disabled={!isRegistFormValid} maxLength={4} pattern="[0-9]{4}">exit</button>
			</label>
			</form>
			<br />
		</div>
	);
}