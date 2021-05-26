const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const colors = require("colors");
const connectDB = require("./backend/config/db");

const productRoutes = require("./backend/routes/productRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const orderRoutes = require("./backend/routes/orderRoutes");
const uploadRoutes = require("./backend/routes/uploadRoutes");

dotenv.config();
connectDB();
const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());
app.use(helmet());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "development") {
  // Step 1:
  app.use(express.static(path.resolve(__dirname, "./frontend/build")));
  // Step 2:
  app.get("*", function (request, response) {
    response.sendFile(
      path.resolve(__dirname, "./frontend/build", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
});
