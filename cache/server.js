const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connection = require("./connect.json");
const app = express();
const port = 6969;
const Cache = require("./models/CacheSchema");
var access_no = 0;
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/cacheDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", async () => {
  try {
    // Delete previous entries
    await Cache.deleteMany({});
    console.log("Previous entries deleted");
  } catch (error) {
    console.error("Error deleting previous entries:", error);
  }
});

// Routes
app.post("/query", async (req, res) => {
  const filedata = req.body.file;
  const analyticsType = req.body.analyticsType;

  try {
    let cacheEntry = await Cache.findOne({
      gene_content: filedata,
      analytics_type: analyticsType,
    });
    if (!cacheEntry) {
      return res.json({ msg: "Data not found in cache" });
    }

    // Increment accessNo
    access_no++;

    // Update accessNo field in the cache entry
    cacheEntry.accessNo = access_no;
    await cacheEntry.save(); 

    res.json({ analytics: cacheEntry.analytics });
  } catch (error) {
    console.error("Error querying cache:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/insert", async (req, res) => {
  const filedata = req.body.file;
  const analyticsType = req.body.analyticsType;
  const analytics = JSON.parse(req.body.analytics);

  try {
    // Increment accessNo
    access_no++;

    const cacheEntry = await Cache.findOneAndUpdate(
      { gene_content: filedata, analytics_type: analyticsType },
      { $set: { analytics: analytics, accessNo: access_no } }, // Include accessNo
      { upsert: true, new: true }
    ); 
    res.json({ success: "Added/Updated record successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Cache server running at http://localhost:${port}`);
});
