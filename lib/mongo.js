import bug from 'debug'
const debug = bug('bearded:mongo')
import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost/bearded')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error: '))

db.once('open', cb => {
  debug('MongoDB connected')
})

export default db
