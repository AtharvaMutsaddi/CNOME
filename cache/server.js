const express = require("express");
const mysql = require("mysql");
const sqlconnectionstring = require("./sqlconnect.json");
const app = express();
const port = 6969;

app.use(express.json());
app.listen(port, () => {
  console.log(`Cache server running at http://localhost:${port}`);
});

const db = mysql.createConnection(sqlconnectionstring);
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
  const emptyCacheQuery = "TRUNCATE TABLE cache";
  db.query(emptyCacheQuery, (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Database cache emptied");
  });
});

app.get("/", (req, res) => {
    const filedata = req.body.file; 
    console.log(filedata);
    const analyticsType = req.body.analyticsType; 
    console.log(analyticsType);
    const query = `SELECT analytics FROM cache WHERE gene_content=? AND analytics_type=?`;
    db.query(query, [filedata, analyticsType], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      const parsedResult = result.map(entry => ({
        analytics: JSON.parse(entry.analytics)
      }));
      res.json(parsedResult[0]);
    });
});


