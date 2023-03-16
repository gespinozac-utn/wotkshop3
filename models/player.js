const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const player = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  team: { type: String }
});
module.exports = { "model" : mongoose.model('players', player), "schema" : player};