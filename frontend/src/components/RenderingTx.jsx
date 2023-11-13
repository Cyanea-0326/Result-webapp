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
		// <div style={{ display: 'flex' }}>
		// 	<div style={{ marginRight: '100px' }}>
		<div className=''>
				<div class="p-2 bg-white rounded-b-xl shadow-lg">
					<div className='flex flex-col items-center'>
					<p className='font-bold border-b border-gray-800'>GET TRANSACTION</p>
						<form onSubmit={handleGetTx} className='pt-4 flex flex-col place-items-center'>
						<label>
							<span>USER</span>
							<input type="user" value={user} onChange={handleUserChange} 
							className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Enter name"/>
						</label>
						<label>
							<span>PIN</span>
							<input type="pin" value={pin} onChange={handlePinChange} maxLength={4} pattern="[0-9]{4}"
							className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Enter PIN"/>
						</label>
							<div className='pt-4 pb-2'>
								<button type="regist" disabled={!isRegistFormValid} maxLength={4} pattern="[0-9]{4}" 
								className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">
								get</button>
							</div>
						</form>
				</div>
			</div>
			{/* Txlist の表示 */}
				<div class="mt-10 p-2 max-w-xl mx-auto bg-white rounded-xl shadow-lg">
					<div className='flex flex-col items-center mt-4 overflow-x-auto'>
						<p className='font-bold'>TRANSACTIONS</p>
					</div>
					<table className="min-w-full bg-white">
						<thead>
							<tr className="border-t border-gray-300">
								<th className="py-2 px-4 border-r border-l border-gray-300 text-center">TX_ID</th>
								{/* <th className="py-2 px-4 border-r border-gray-300">U_ID</th> */}
								<th className="py-2 px-4 border-r border-gray-300 text-center">Bet Amount</th>
								<th className="py-2 px-4 border-r border-gray-300 text-center">PayOff</th>
								<th className="py-2 px-4 border-r border-gray-300 text-center">Result</th>
								<th className="py-2 px-4 border-r border-gray-300 text-center">Total Result</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction) => (
								<tr key={transaction.tx_id} className="border-t border-gray-300">
								<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.tx_id}</td>
								{/* <td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.u_id}</td> */}
								<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.bet_amount}</td>
								<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.pay_off}</td>
								<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.result}</td>
								<td className="py-2 px-4 text-center">{transaction.total_result}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
		</div>
	);
}