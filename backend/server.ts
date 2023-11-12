import express, { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import bodyParser from 'body-parser';
import cors from "cors";
import * as sql from "./sql";

const app: Express = express();
const port = 3001;
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15分間
	max: 10, // 最大100回まで
	message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
	sql.init_tables();
	res.send("Hello World!");
});

// declare interface RowDataPacket {
// 	constructor: {
// 	  name: "RowDataPacket";
// 	};
// 	[column: string]: any;
// 	[column: number]: any;
// }
// interface IUsers extends RowDataPacket {
// 	u_id: Number
// 	u_name: String
// 	pin: Number
// 	create_at: any
// 	// [Symbol.iterator](): IterableIterator<OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket>;
// }
// interface ITransactions {
// 	tx_id: Number
// 	u_id: Number
// 	bet_amount: Number
// 	pay_off: Number
// 	result: Number
// };

app.post("/registUser", async (req: Request, res: Response) => {
	const { regist_user, regist_pin } = req.body;

	try {
		const result = await sql.regist_new_user(regist_user, regist_pin)
		// console.log("result is:", result);

		if (result !== 0) {
			console.log("It has already been registered");
			// curl -X POST -H "Content-Type: application/json" -d '{"new_user": "testo"}' http://localhost:3001/registUser
			return res.status(500).json({ message: "It has already been registered" });
		}

		console.log("User registration has been completed");
		return res.status(200).json({ message: "User registration has been completed" });

	} catch (error) {
		console.error('Error saving number:', error);
		res.status(500).json({ message: 'Failed to register new user' });
	}
});

app.post("/saveTx", async (req: Request, res: Response) => {
	const { user, auth_pin, bet, payoff } = req.body;
	
	try {
		const [u_row]: any = await sql.connection.promise().query(`SELECT u_id, pin FROM users WHERE u_name = (?)`, [user]);
		const u_id = u_row[0] ? u_row[0].u_id : null;
		const pin = u_row[0]?.pin;
		// console.log("auth is", pin);
		if (u_id == null || pin !== auth_pin) {
			console.log("User not found or PIN is different");
			return res.json({ message: "User not found or PIN is different" });
		};
		
		const total_amount = (-1 * (parseInt(bet) - parseInt(payoff)));
		// console.log(bet, "\n", payoff, "\n", total_amount);
		await sql.connection.promise().query('INSERT INTO transactions \
			(u_id, bet_amount, pay_off, result) VALUES (?, ?, ?, ?)', [u_id, bet, payoff, total_amount]);

		res.status(200).json({ message: 'Saved transaction successfully' });
		console.log('Saved transaction successfully');
	} catch (error) {
		console.error('Error saving number:', error);
		res.status(500).json({ message: 'Failed to save transaction\nCheck input valuses.' });
	}
});

app.post("/exitUser", async (req: Request, res: Response) => {

	const { user, auth_pin } = req.body;
	try {
		const [row]: any = await sql.connection.promise().query(`SELECT u_id, pin FROM users WHERE u_name = (?)`, [user]);
		const u_id = row[0] ? row[0].u_id : null;
		const pin = row[0]?.pin;

		// console.log("auth is", auth_pin, "\n", u_id, pin);
		if (u_id == null || pin != auth_pin) {
			console.log("User not found or PIN is different");
			res.status(500).json({ message: "User not found or PIN is different" });
			return ;
		};
		sql.exit_user(u_id);
		res.status(200).json({ message: "User data has been deleted..." });
	} catch (error) {
		console.error('Error saving number:', error);
		res.status(500).json({ message: 'Failed to save number' });
	}
});

app.post("/renderingTx", async (req, res) => {
	const { user, auth_pin } = req.body;

	try {
		const [u_row]: any = await sql.connection.promise().query(`SELECT u_id, pin FROM users WHERE u_name = (?)`, [user]);
		// console.log("u_row is: ",u_row[0]); ///////////////////////////
		const u_id = u_row[0]?.u_id;
		const pin = u_row[0]?.pin;

		// console.log(pin, "===", auth_pin);
		if (u_id == null || pin != auth_pin) {
			console.log("User not found or PIN is different");
			res.status(500).json({ message: "User not found or PIN is different" });
			return ;
		};
		
		const [tx_history]: any = await sql.connection.promise().query("SELECT * FROM transactions WHERE u_id = (?)", [u_id]);
		// total_resultを計算
		tx_history[0].total_result = parseInt(tx_history[0].result);
		tx_history.slice(1).forEach((value: any, index: any) => {
			tx_history[index + 1].total_result = parseInt(tx_history[index + 1].result) + parseInt(tx_history[index].total_result);
		});

		res.status(200).json(
			{
				message: "Successfully retrieved transaction history",
				tx_data: tx_history
			}
		);
		} catch (error) {
			console.error('Error Failed process:', error);
			res.status(500).json({ message: 'Failed process' });
		}
	}
);

app.post("/editTx", async (req, res) => {
	const { tx_id, user, auth_pin, bet, payoff } = req.body;

	try {
		const [u_row]: any = await sql.connection.promise().query(`SELECT u_id, pin FROM users WHERE u_name = (?)`, [user]);
		const u_id = u_row[0]?.u_id;
		const pin = u_row[0]?.pin;
		if (u_id == null || pin !== auth_pin) {
			console.log("User not found or PIN is different");
			res.status(500).json({ message: "User not found or PIN is different" });
			return ;
		};
		if (bet === "DELETE" && payoff === "DELETE") {
			const [row]: any = await sql.connection.promise().query(`SELECT u_id, tx_id FROM transactions WHERE u_id = (?)`, [u_id]);
			let i = 0; 
			console.log(user);
			while (row[i]) {
				console.log(row[i].tx_id, row[i].u_id);
				if (row[i].tx_id == tx_id && row[i].u_id == u_id) {
					await sql.connection.promise().query(`DELETE FROM transactions WHERE tx_id = (?)`, [tx_id]);
					return res.status(200).json({message: "Successfully DELETE process"});
				}
				i++;
			};
			return res.status(500).json({message: "Failed to DELETE process"});
		} else {
			const [row]: any = await sql.connection.promise().query(`SELECT u_id, tx_id FROM transactions WHERE u_id = (?)`, [u_id]);
			let i = 0; 
			while (row[i]) {
				if (row[i].tx_id == tx_id && row[i].u_id == u_id) {
					const total_amount = (-1 * (parseInt(bet) - parseInt(payoff)));
					await sql.connection.promise().query(`UPDATE transactions \
					SET bet_amount = (?), pay_off = (?), result = (?) WHERE tx_id = (?)`, [ bet, payoff, total_amount, tx_id]);
					
					console.log("Successfully UPDATE process");
					return res.status(200).json({message: "Successfully UPDATE process"});
				}
				i++;
			}
			return res.status(500).json({message: "Failed to UPDATE process"});
		};
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Failed process' });
	};
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

