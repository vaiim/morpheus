/**
 * Schema Definitions
 *
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RefereceSchema = new mongoose.Schema({
  title: String,
  grade: String,
  answers: [{answer: String, topic: String, average: Number}],
  average: Number,
  version: String,
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Topic' collection in the MongoDB database
export default mongoose.model('Reference', RefereceSchema);

