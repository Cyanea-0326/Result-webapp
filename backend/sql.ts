import mysql from "mysql2";
import * as dotenv from 'dotenv';
import { resolve } from "path";
import { log } from "console";

dotenv.config();

export const connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 3306,
	user: "root",
	password: process.env.PASSWORD,
	database: "todos",
});

connection.connect((error) => {
	if (error) {
		console.error("Error connecting to MySQL: ", error);
		return;
	}
	console.log("Success connecting to MySQL");
});

export function init_tables() {
	connection.connect(function (err) {
		if (err) throw err;
		connection.query("DROP TABLE IF EXISTS transactions",
			function (err, result) { if (err) throw err });
		connection.query("DROP TABLE IF EXISTS users",
			function (err, result) { if (err) throw err });
		console.log("\n\n////////////////////////////////////////\n");
		console.log("DROP TABLES...");

		// create users_table
		connection.query("CREATE TABLE users (\
			u_id INT AUTO_INCREMENT PRIMARY KEY, \
			u_name VARCHAR(255), \
			pin CHAR(4), \
			create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
			CHECK (PIN REGEXP '^[0-9]{4}$') \
		)",
			function (err, result) { if (err) throw err
		});
		// create tx_table
		connection.query("CREATE TABLE transactions (\
			tx_id INT AUTO_INCREMENT PRIMARY KEY, \
			u_id INT, \
			bet_amount DECIMAL, \
			pay_off DECIMAL, \
			result DECIMAL \
		)",
			function (err, result) { if (err) throw err
			console.log("INIT TABLES SUCCESS");
			console.log("\n////////////////////////////////////////\n\n");
		});
	});
};

export function regist_new_user(u_name: String, pin: String): Promise<any> {
	return new Promise((resolve, reject) => {
		connection.connect(function (err) {
			if (err) throw err;
			// console.log("success");
			// console.log(u_name, pin);
			connection.query('SELECT * FROM users WHERE u_name = ?', [u_name],
			function (err, rows) {
				if (err) throw err;
				if ((rows as any).length > 0) {
					resolve (1);
				} else {
					connection.query(`INSERT INTO users (u_name, pin) VALUES (?, ?)`, [u_name, pin],
						function (err, result) {
						if (err) throw err;
						console.log('regist new user');
						resolve (0);
					});
				};
			});
		});
	});
};

export async function rendering_transaction(u_id: Number): Promise<any> {

	try {
		await connection.connect();
	
		const [rows]: any = await connection.query("SELECT * FROM transactions WHERE u_id = (?)", [u_id]);
		console.log("TX_LIST is: ", rows);
		return rows;
	  } catch (err) {
		console.error(err);
		throw err;
	  } finally {
		await connection.end();

		// connection.connect(function (err) {
		// 	if (err) throw err;
		// 	const [rows]: any = connection.query("SELECT * FROM transactions WHERE u_id = (?)", [u_id]);
		// 	console.log("TX_LIST is: ", rows);
		// 	resolve (rows);
		// });
	};
};

export function exit_user(u_id: Number) {
	connection.query("DELETE FROM transactions WHERE u_id = (?)", [u_id],
	function (err, result) {
		if (err) throw err;
	});
	connection.query("DELETE FROM users WHERE u_id = (?)", [u_id],
	function (err, result) {
		if (err) throw err;
	});
	console.log("User data has been deleted...");
};

// export function delete_record() {
// 	connection.connect(function (err) {
// 		if (err) throw err;
// 		console.log("success");
// 		connection.query(`DELETE FROM transactions`,
// 		function (err, result) {
// 			if (err) throw err;
// 			console.log('reset table');
// 		});
// 	});
// }

// export function add_record() {
// 	connection.connect(function (err) {
// 		if (err) throw err;
// 		console.log("success");
// 		connection.query(`INSERT INTO todo (amount, result) SELECT -100, SUM(amount) FROM todo`,
// 		function (err, result) {
// 			if (err) throw err;
// 			console.log('add record');
// 		});
// 	});
// }