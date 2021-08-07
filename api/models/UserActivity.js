import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userActivitySchema = new Schema({
  posts: [
    { type: Schema.Types.ObjectId, ref: 'Post' }
  ],
  comments: [
    { type: Schema.Types.ObjectId, ref: 'Comment' }
  ],
  reactions: [
    { type: Schema.Types.ObjectId, ref: 'Reaction' }
  ],
  threadHistory: [
    { type: Schema.Types.ObjectId, ref: 'Thread' }
  ]
}, {
  collection: 'userActivities'
})

export default mongoose.model('UserActivity', userActivitySchema)
