const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const sqlconnectionstring = require("./sqlconnect.json");
const app = express();
const multer = require("multer");
const port = 6969;
var accessNo = 1;

app.use(cors());
app.use(express.json());
app.listen(port, () => {
  console.log(`Cache server running at http://localhost:${port}`);
});

const upload = multer();

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

app.post("/query", upload.single("file"), async (req, res) => {
  const filedata = req.file.buffer.toString("utf8");
  const analyticsType = req.body.analyticsType;
  const query = `SELECT analytics FROM cache WHERE gene_content=? AND analytics_type=?`;
  db.query(query, [filedata, analyticsType], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (result.length === 0) {
      return res.json({ msg: "ullu bnaaya bada maza aaya" });
    }
    console.log(result[0].analytics);
    const parsedResult = result.map((entry) => ({
      analytics: JSON.parse(entry.analytics),
    }));
    accessNo++;
    const updateQuery = `UPDATE cache SET access_no = ? WHERE gene_content = ? AND analytics_type = ?`;
    db.query(
      updateQuery,
      [accessNo, filedata, analyticsType],
      (err, result) => {
        if (err) {
          console.error("Error executing update query:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        res.json(parsedResult[0]);
      }
    );
  });
});

app.post("/insert", upload.single("file"), (req, res) => {
  const filedata = req.file.buffer.toString("utf8");
  const analyticsType = req.body.analyticsType;
  const analytics = req.body.analytics;
  // Check if the record exists
  const checkQuery = `SELECT * FROM cache WHERE gene_content = ? AND analytics_type = ?`;
  db.query(checkQuery, [filedata, analyticsType], (err, result) => {
    if (err) {
      console.error("Error executing check query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (result.length > 0) {
      // Record already exists, update accessNo
      const updateQuery = `UPDATE cache SET access_no = ? WHERE gene_content = ? AND analytics_type = ?`;
      db.query(
        updateQuery,
        [accessNo, filedata, analyticsType],
        (err, result) => {
          if (err) {
            console.error("Error executing update query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          res.json({ success: "Updated accessNo successfully!" });
        }
      );
    } else {
      const getCountQuery = `SELECT COUNT(*) AS count FROM cache`;
      db.query(getCountQuery, (err, result) => {
        if (err) {
          console.error("Error getting count from DB", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        const count = result[0].count;
        if (count >= 15) {
          const delQuery = `DELETE FROM cache WHERE access_no=(SELECT MIN(access_no) FROM cache) LIMIT 1`;
          db.query(query, (err, result) => {
            if (err) {
              console.error("Error getting count from DB", err);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }
          });
        }
        const insertQuery = `INSERT INTO cache VALUES (?, ?, ?, ?)`;
        db.query(
          insertQuery,
          [filedata, analyticsType, analytics, accessNo],
          (err, result) => {
            if (err) {
              console.error("Error executing insert query:", err);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }
            res.json({ success: "Added record successfully!" });
          }
        );
      });
    }
  });
});
