const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  onPost: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  text: {
    type: String
  }
}, {
  collection: 'comments'
})

module.exports = mongoose.model('Comment', commentSchema)
