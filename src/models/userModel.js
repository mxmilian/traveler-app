const mongoose = require('mongoose');
const { isEmail, isAlphanumeric } = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!👿'],
    unique: [true, 'This name is in used!🤭'],
    maxlength: [40, 'An account must have less or equal then 40 characters!👿'],
    minlength: [10, 'An account must have more or equal then 10 characters!👿'],
    trim: true,
    validate: {
      validator: isAlphanumeric,
      message: 'Name can contains only letters and numbers!👿'
    }
  },
  email: {
    type: String,
    required: [true, 'E-mail is required!👿'],
    unique: [true, 'This e-mail is in used!🤭'],
    maxlength: [40, 'An e-mail must have less or equal then 40 characters!👿'],
    minlength: [10, 'An e-mail must have more or equal then 10 characters!👿'],
    trim: true,
    lowercase: true,
    validate: {
      validator: isEmail,
      message: 'This is not an e-mail! 👿'
    }
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is required!👿'],
    maxlength: [40, 'Password must have less or equal then 40 characters!👿'],
    minlength: [8, 'Password must have more or equal then 10 characters!👿'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'moderator', 'admin'],
    default: 'user'
  },
  confirmPassword: {
    type: String,
    required: [true, 'Password is required!👿'],
    maxlength: [40, 'Password must have less or equal then 40 characters!👿'],
    minlength: [8, 'Password must have more or equal then 10 characters!👿'],
    validate: {
      //This works only for CREATE and SAVE
      validator: function() {
        return this.password === this.confirmPassword;
      },
      message: 'These passwords are not the same👿'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

//Encryption password by using mongoose middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.createPassResToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(`reset token${resetToken} hashes${this.passwordResetToken}`);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
