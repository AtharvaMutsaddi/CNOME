const mongoose = require('mongoose');
const cacheSchema = new mongoose.Schema({
  gene_content: String,
  analytics_type: String,
  analytics: Object,
  access_no: Number,
});

module.exports = mongoose.model("CacheSchema", cacheSchema);