var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SnopesStuffSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var SnopesStuff = mongoose.model("SnopesStuff", SnopesStuffSchema);

module.exports = SnopesStuff;
