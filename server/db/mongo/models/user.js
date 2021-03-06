/**
 * Defining a User Model in mongoose
 * Code modified from https://github.com/sahat/hackathon-starter
 */

import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

// Other oauthtypes to be added

/*
 User Schema
 */

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  tokens: Array,
  name: { type: String, default: '' },
  branch: {
    location: String,
    name: String,
    website: { type: String, default: '' },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

function encryptPassword(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  return bcrypt.genSalt(5, (saltErr, salt) => {
    if (saltErr) return next(saltErr);
    return bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) return next(hashErr);
      user.password = hash;
      return next();
    });
  });
}

/**
 * Password hash middleware.
 */
UserSchema.pre('save', encryptPassword);

/*
 Defining our own custom document instance method
 */
UserSchema.methods = {
  comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  }
};

/**
 * Statics
 */

UserSchema.statics = {
  wash: function(obj) {
    if(typeof(obj) === 'string') {
      obj = JSON.parse(obj);
    }
    const user = {branch:{}};
    user.name = obj.username;
    user.username = obj.username;
    user.email = obj.email;
    if(!obj.branch) return user;
    user.branch.location = obj.branch.address;
    user.branch.name = obj.branch.branchName;
    return user;
  }
};

export default mongoose.model('User', UserSchema);
