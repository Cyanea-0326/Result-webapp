import React, { useState } from 'react';

export function RenderingTx() {
	const [user, setUser] = useState('');
	const [pin, setPin] = useState('');

	const handleUserChange = (e) => {
		setUser(e.target.value);
	};
	const handlePinChange = (e) => {
		setPin(e.target.value);
	};

	const [transactions, setTransactions] = useState([]);
	const handleGetTx = async (event) => {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:3001/renderingTx', {
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
				setTransactions(res.tx_data);
				// alert(res.message);
			} else {
				const res = await response.json();
				console.log('Server response:', res);

				alert(res.message);
			};
		} catch (error) {
			console.log(error);
			alert(`${error}\nPls check status-code`);
		};

	};

	const isRegistFormValid = (user.trim() !== '' && pin.trim() !== '' && isValidPin(pin));

	function isValidPin(pin) {
		const pinPattern = /^[0-9]{4}$/;
		return pinPattern.test(pin);
	}

	return (
		<div style={{ display: 'flex' }}>
			<div style={{ marginRight: '100px' }}>
				<b>GET TRANSACTION</b>
				<form onSubmit={handleGetTx}>
				<label>
					user :
					<input type="user" value={user} onChange={handleUserChange} />
				</label>
					<br/>
				<label>
					PIN :
					<input type="pin" value={pin} onChange={handlePinChange} maxLength={4} pattern="[0-9]{4}" />
					<br/>
					<button type="regist" disabled={!isRegistFormValid} >get</button>
				</label>
				</form>
			</div>
			{/* Txlist の表示 */}
			<div>
				<b>TRANSACTIONS</b>
				<table>
					<thead>
						<tr>
						<th style={{ width: '0px' }}>TX_ID</th>
						{/* <th style={{ width: '150px' }}>U_ID</th> */}
						<th style={{ width: '150px' }}>Bet Amount</th>
						<th style={{ width: '150px' }}>Pay Off</th>
						<th style={{ width: '150px' }}>Result</th>
						<th style={{ width: '150px' }}>Total Result</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((transaction) => (
							<tr key={transaction.tx_id}>
							<td style={{ textAlign: 'center' }}>{transaction.tx_id}</td>
							{/* <td style={{ textAlign: 'center' }}>{transaction.u_id}</td> */}
							<td style={{ textAlign: 'center' }}>{transaction.bet_amount}</td>
							<td style={{ textAlign: 'center' }}>{transaction.pay_off}</td>
							<td style={{ textAlign: 'center' }}>{transaction.result}</td>
							<td style={{ textAlign: 'center' }}>{transaction.total_result}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}