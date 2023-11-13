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
		<div class="p-2 bg-white rounded-b-xl shadow-lg">
			<div className='flex flex-col items-center'>

			<p className='font-bold border-b border-gray-800'>EDIT TRANSACTION</p>
			<form onSubmit={handleSubmit} className='pt-4 flex flex-col place-items-center'>
				<label>
				<span>USER</span>
				<input type="user" value={user} onChange={handleUserChange}
				className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				placeholder="Enter name"/>
				</label>
				<label>
				<span>PIN</span>
				<input type="pin" value={pin} onChange={handlePinChange}  maxLength={4} pattern="[0-9]{4}"
				className="flex place-items-center p border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				placeholder="Enter 4 numbers"/>
				</label>
				<label>
				<span>TX_ID</span>
				<input type="tx_id" value={tx_id} onChange={handleTx_idChange}
				className="flex place-items-center p border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				placeholder="Enter tx_id"/>
				</label>
				<label>
				<span>EDIT_BET</span>
				<input type="bet" value={bet} onChange={handleBetChange} 
				className="flex place-items-center p border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				placeholder="Enter"/>
				</label>
				<label>
				<span>EDIT_PAYOFF</span>
				<input type="payoff" value={payoff} onChange={handlePayoffChange} 
				className="flex place-items-center p border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				placeholder="Enter"/>
				</label>
				<div className='pt-4 pb-2'>
					<button type="submit" disabled={!isFormValid} 
					className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">
					edit</button>
				</div>
			</form>
				<p className='fpt-2 pb-2 text-gray-300'>※TXデータを削除する際は、BETとPAYOFFに DELETE と入力してください</p>
			</div>
		</div>
	);
};