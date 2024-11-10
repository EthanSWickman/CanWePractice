import sqlite3 from "sqlite3" 
sqlite3.verbose()

async function createDbConnection() {
	const db = new sqlite3.Database('/.app.db', (err) => {
		if (err) {
			return console.error(err.message)
		}
	})

	await db.query(sql`
		CREATE TABLE IF NOT EXISTS config (
			server_id VARCHAR 30 NOT NULL PRIMARY KEY,
				
		)	
		`)

	console.log("Connection with SQLite has been established");
	return db
}

function GetConfig() {

}

export default createDbConnection()