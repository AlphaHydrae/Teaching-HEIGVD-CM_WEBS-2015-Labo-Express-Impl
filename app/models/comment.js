var
	mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: String,
	postedOn: { type: Date, default: Date.now},
	_author: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Comment', CommentSchema);

