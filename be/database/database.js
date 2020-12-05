const sqlite3 = require('sqlite3').verbose();
var path = require('path')

console.log(__dirname)

// Setup the database connection
let db = new sqlite3.Database(__dirname+'/database.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');
});

// Close the DB connection
/*db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});*/

module.exports = db;