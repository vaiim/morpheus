/**
 * Schema Definitions
 *
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TestResultSchema = new mongoose.Schema({
  answers: {
    english: [],
    math: [],
    general: [],
  },
  student: {
    name: String,
    grade: Number,
  },
  branchName: String,
  version: String,
  created: {
    type: Date,
    default: Date.now,
  }
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Topic' collection in the MongoDB database
export default mongoose.model('TestResult', TestResultSchema);

