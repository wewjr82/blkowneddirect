const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 7160;
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING;
dbName = "blackOwnedDirect";

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  })
  .catch((error) => console.error(error));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
  db.collection("businesses")
    .find()
    .toArray()
    .then((data) => {
      response.render("index.ejs", { businesses: data });
    })
    .catch((error) => console.error(error));
});

app.post("/addYourBusiness", (request, response) => {
  db.collection("businesses")
    .insertOne({
      name: request.body.businessName,
      industry: request.body.industry,
      webSite: request.body.webSite,
      phone: request.body.businessPhone,
      address: request.body.businessAddress,
      city: request.body.businessCity,
      state: request.body.businessState,
      zipCode: request.body.businessZip,
    })
    .then((result) => {
      console.log("Business Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
