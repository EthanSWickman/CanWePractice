const sqlite3 = require("sqlite3").verbose();
const filepath = "./app.db";

function createDbConnection() {
	const db = new sqlite3.Database(filepath, (err) => {
		if (err) {
			return console.error(err.message)
		}
	});
	console.log("Connection with SQLite has been established");
	return db
}
