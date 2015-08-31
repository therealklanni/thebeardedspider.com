import mongoose from 'mongoose'
import { Schema, model } from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'

const userSchema = Schema({
  twitchId: Schema.Types.String,
  logo: String,
  bio: String,
  createdAt: Schema.Types.Date,
  updatedAt: Schema.Types.Date,
  username: Schema.Types.String,
  displayName: Schema.Types.String,
  email: Schema.Types.String
})

userSchema.plugin(findOrCreate)

const User = mongoose.model('User', userSchema)

export default User
