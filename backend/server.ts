import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import * as db from "./db";

const app: Express = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
	db.init_tables();
	res.send("Hello World!");
});


// declare interface RowDataPacket {
	// 	constructor: {
		// 	  name: "RowDataPacket";
		// 	};
		// 	[column: string]: any;
		// 	[column: number]: any;
		// }

app.post("/registUser", async (req: Request, res: Response) => {
	const { regist_user, regist_pin } = req.body;

	try {
		const result = await db.regist_new_user(regist_user, regist_pin)
		console.log("result is:", result);

		if (result !== 0) {
			console.log("It has already been registered");
			// curl -X POST -H "Content-Type: application/json" -d '{"new_user": "testo"}' http://localhost:3001/registUser
			return res.json({ message: "It has already been registered" });
		}

		console.log("User registration has been completed");
		return res.json({ message: "User registration has been completed" });

	} catch (error) {
		console.error('Error saving number:', error);
		res.status(500).json({ message: 'Failed to register new user' });
	}
});

app.post("/saveTx", async (req: Request, res: Response) => {
	
	const { user, auth_pin, bet, payoff } = req.body;
	
	try {
		const [u_row]: any = await db.connection.promise().query(`SELECT u_id, pin FROM users WHERE u_name = (?)`, [user]);
		const u_id = u_row[0] ? u_row[0].u_id : null;
		const pin = u_row;
		// console.log("auth is", auth_pin, "\n", u_id, pin);
		if (u_id == null || pin === auth_pin) {
			console.log("User not found or PIN is different");
			return res.json({ message: "User not found or PIN is different" });
		}
		
		const total_amount = (-1 * (parseInt(bet) - parseInt(payoff)));
		// console.log(bet, "\n", payoff, "\n", total_amount);
		
		await db.connection.promise().query('INSERT INTO transactions (u_id, bet_amount, pay_off, result) VALUES (?, ?, ?, ?)', [u_id, bet, payoff, total_amount]);
		
		const [rows]: any = await db.connection.promise().query('SELECT MAX(tx_id) FROM transactions');
		const latestId: number = rows[0]['MAX(tx_id)'];
		// console.log(rows, latestId);

		// init temp
		await db.connection.promise().query("DROP TEMPORARY TABLE IF EXISTS tmp_result");
		
		// calc total_result
		await db.connection.promise().query("CREATE TEMPORARY TABLE tmp_result AS \
			SELECT SUM(result) as total_amount FROM transactions WHERE u_id = (?)", [u_id]);
		await db.connection.promise().query(' \
			UPDATE transactions SET total_result = (SELECT total_amount FROM tmp_result) \
			WHERE tx_id = (?)', [latestId]
		);
		
		await db.connection.promise().query("DROP TEMPORARY TABLE IF EXISTS tmp_result");

		res.status(200).json({ message: 'Saved transaction successfully' });
		console.log('Saved transaction successfully');
	} catch (error) {
		console.error('Error saving number:', error);
		res.status(500).json({ message: 'Failed to save number' });
	}
});

app.post("/exitUser", async (req: Request, res: Response) => {

	const { user, auth_pin } = req.body;
	try {
		const [u_row]: any = await db.connection.promise().query(`SELECT u_id, pin FROM users WHERE u_name = (?)`, [user]);
		const u_id = u_row[0] ? u_row[0].u_id : null;
		const pin = u_row;
		// console.log("auth is", auth_pin, "\n", u_id, pin);
		if (u_id == null || pin === auth_pin) {
			console.log("User not found or PIN is different");
			res.status(200).json({ message: "User not found or PIN is different" });
			return ;
		}
		db.exit_user(u_id);
		res.status(200).json({ message: "User data has been deleted..." });
	} catch (error) {
		console.error('Error saving number:', error);
		res.status(500).json({ message: 'Failed to save number' });
	}
});



app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

		// app.get("/add", (req: Request, res: Response) => {
		// 	let u_name = "hello";
		// 	db.add_new_user(u_name);
		// 	res.send("add records");
		// });
		
		// app.get("/delete", (req: Request, res: Response) => {
		// 	db.delete_record();
		// 	res.send("reset table");
		// });
