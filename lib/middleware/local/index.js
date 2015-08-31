const locals = {}

export default (req, res, next) => {
  req.locals = locals
  next()
}
