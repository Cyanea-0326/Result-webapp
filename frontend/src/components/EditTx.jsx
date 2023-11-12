import React, { useState } from 'react';

export const EditTx = () => {
		const [tx_id, setTx_id] = useState('');
		const [user, setUser] = useState('');
		const [pin, setPin] = useState('');
		const [bet, setbet] = useState('');
		const [payoff, setpayoff] = useState('');

		const handleTx_idChange = (event) => {
			setTx_id(event.target.value);
		};
		const handleUserChange = (event) => {
			setUser(event.target.value);
		};
		const handlePinChange = (event) => {
			setPin(event.target.value);
		};
		const handleBetChange = (event) => {
			setbet(event.target.value);
		};
		const handlePayoffChange = (event) => {
			setpayoff(event.target.value);
		};

		const handleSubmit = async (event) => {
			event.preventDefault();

			try {
				const response = await fetch('http://localhost:3001/editTx', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						tx_id: tx_id,
						user: user,
						auth_pin: pin,
						bet: bet,
						payoff: payoff
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
				};
			};
	
	const isFormValid = tx_id.trim() !== '' && user.trim() !== '' &&
		pin.trim() !== '' && bet.trim() !== '' && payoff.trim() !== '' && isValidPin(pin);
	
		function isValidPin(pin) {
			const pinPattern = /^[0-9]{4}$/;
			return pinPattern.test(pin);
		}

	return (
		<div>
			<b>EDIT TRANSACTION</b>
			<form onSubmit={handleSubmit}>
				<label>
				user :
				<input type="user" value={user} onChange={handleUserChange} />
				</label>
					<br/>
				<label>
				PIN :
				<input type="pin" value={pin} onChange={handlePinChange}  maxLength={4} pattern="[0-9]{4}"/>
				</label>
					<br/>
				<label>
				TX_ID :
				<input type="tx_id" value={tx_id} onChange={handleTx_idChange} />
				</label>
					<br/>
				<label>
				edit_bet :
				<input type="bet" value={bet} onChange={handleBetChange} />
				</label>
					<br/>
				<label>
				edit_payoff	:
				<input type="payoff" value={payoff} onChange={handlePayoffChange} />
				</label>
					<br />
				<button type="submit" disabled={!isFormValid} >edit</button>
			</form>
				<p>※TXデータを削除する際は、betとpayoffに DELETE と入力してください</p>
		</div>
	);
};