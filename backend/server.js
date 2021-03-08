const express = require("express");
const dotenv = require("dotenv");
var bodyParser = require('body-parser')
const colors = require("colors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();
const cors = require("cors");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(cors());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.port}`
      .yellow.bold
  );
});
