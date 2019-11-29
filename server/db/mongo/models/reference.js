/**
 * Schema Definitions
 *
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RefereceSchema = new mongoose.Schema({
  english: [{answer: String, topic: String, rate: Number}],
  maths: [{answer: String, topic: String, rate: Number}],
  general: [{answer: String, topic: String, rate: Number}],
  statistics: {
    english: Number,
    maths: Number,
    general: Number,
  },
  version: String,
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Topic' collection in the MongoDB database
export default mongoose.model('Referece', RefereceSchema);

