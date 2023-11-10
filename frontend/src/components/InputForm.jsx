import React, { useState } from 'react';

export const InputForm = () => {
		const [user, setUser] = useState('');
		const [pin, setPin] = useState('');
		const [bet, setbet] = useState('');
		const [payoff, setpayoff] = useState('');


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
				const response = await fetch('http://localhost:3001/saveTx', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
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
					console.error('Failed to save bet & payoff');
				}
				} catch (error) {
					console.error('Error:', error);
				}
			};
	
	const isFormValid = user.trim() !== '' && pin.trim() !== '' && bet.trim() !== '' && payoff.trim() !== '';

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
				user :
				<input type="user" value={user} onChange={handleUserChange} />
				</label>
					<br/>
				<label>
				PIN :
				<input type="pin" value={pin} onChange={handlePinChange} />
				</label>
					<br/>
				<label>
				bet_amount :
				<input type="bet" value={bet} onChange={handleBetChange} />
				</label>
					<br/>
				<label>
				pay_off	:
				<input type="payoff" value={payoff} onChange={handlePayoffChange} />
				</label>
					<br />
				<button type="submit" disabled={!isFormValid}>submit</button>
			</form>
		</div>
	);
}