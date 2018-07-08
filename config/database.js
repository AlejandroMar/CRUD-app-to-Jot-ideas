
if (process.env.NODE_ENV === "production") {
    module.exports = {mongoURI: `mongodb://${process.env.DB_USER}:${process.env.BD_KEY}@ds111370.mlab.com:11370/crud-node-app`}
} else {
    module.exports = {mongoURI: "mongodb://localhost:27017/vidjot-dev"}
}
