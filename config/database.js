
if (process.env.NODE_ENV === "production") {
    module.exports = {mongoURI: `mongodb://${process.env.DB_USER}:${process.env.BD_KEY}@ds131711.mlab.com:31711/que-nota`}
} else {
    module.exports = {mongoURI: "mongodb://localhost:27017/vidjot-dev"}
}
