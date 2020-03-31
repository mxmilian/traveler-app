const mongoose = require('mongoose');
const { isEmail, isAlphanumeric } = require('validator');

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
    minlength: [10, 'Password must have more or equal then 10 characters!👿']
  },
  confirmPassword: {
    type: String,
    required: [true, 'Password is required!👿'],
    maxlength: [40, 'Password must have less or equal then 40 characters!👿'],
    minlength: [10, 'Password must have more or equal then 10 characters!👿'],
    validate: {
      validator: function() {
        return this.password === this.confirmPassword;
      },
      message: 'These passwords are not the same👿'
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
