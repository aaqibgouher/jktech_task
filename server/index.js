const express = require("express");
const router = require("./routes");
require("./database/config");
const models = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
