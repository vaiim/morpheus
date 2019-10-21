import { DB_URI } from '../../../config/env';

export const db = process.env.MONGOHQ_URL || process.env.MONGODB_URI || DB_URI;

export default {
  db
};
