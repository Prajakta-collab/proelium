const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserAdminSchema = new Schema({
    Firstname:{
        type: String,
        required: true
    },
    Middlename:{
        type: String,
        required: true
    },
    Lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    }
  }     ,{timestamps: true }
);

  module.exports = mongoose.model('useradmin', UserAdminSchema);