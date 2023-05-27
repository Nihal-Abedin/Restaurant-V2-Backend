const app = require("./app");
const mongoose = require("mongoose");

const Database = process.env.DB_SOURCE.replace(
  "<password>",
  process.env.DB_PASSWORD
);
mongoose
  .connect(Database)
  .then(() => console.log("Successfullt connected to the DB!"))
  .catch((err) => console.log("Cannot connect to the DB!"));

app.listen(process.env.PORT, () =>
  console.log(`Listing on Port: ${process.env.PORT}`)
);
