import sqlite3 from "sqlite3" 
sqlite3.verbose()

const db = new sqlite3.Database('./app.db', (err) => {
    if (err) {
        return console.error(err.message)
    }
})


export async function createDbConnection() {
	await db.run(`
		CREATE TABLE IF NOT EXISTS config (
			server_id VARCHAR(30) NOT NULL PRIMARY KEY,
            loc_timezone VARCHAR(100),  
            loc_lat DECIMAL(8, 6),
            loc_lon DECIMAL(9, 6),
            loc_name VARCHAR(100), 
            units_speed VARCHAR(20),
            units_distance VARCHAR(20),
            units_temperature VARCHAR(20),
            nearest_station VARCHAR(100)
		);

        CREATE TABLE IF NOT EXISTS practice (
            practice_id VARCHAR(30) NOT NULL PRIMARY KEY,
            practice_day VARCHAR(30),
            practice_start DATETIME,
            practice_end DATETIME
        );
    `)

	console.log("Connection with SQLite has been established");
}

export async function newGuild(serverId) {
    // if guild already exists, do nothing
    await db.get(`SELECT server_id from config WHERE server_id == ?`, serverId, (err, row) => {
        if (err)
            return console.error(err)
        else if (row) {
            db.run(
                `INSERT INTO config VALUES 
                (?, "PDT", 44.1132, -123.3039, "Fern Ridge", "knots", "miles", "fahrenheit", "KEUG")`, serverId)

            console.log('new server configuration added to database')
        }
    })
}


