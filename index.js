const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Routes
const mpesaRoutes = require("./routes/mpesaRoutes");
const cardRoutes = require("./routes/cardRoutes");

app.use("/mpesa", mpesaRoutes);
app.use("/card", cardRoutes);

app.get("/", (req, res) => res.send("Payments API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
