/**
 * Schema Definitions
 *
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TestResultSchema = new mongoose.Schema({
  answers: {
    english: [],
    maths: [],
    general: [],
  },
  student: {
    name: String,
    grade: Number,
  },
  branchName: String,
  version: String,
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Topic' collection in the MongoDB database
export default mongoose.model('TestResult', TestResultSchema);

