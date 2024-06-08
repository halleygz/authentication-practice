const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override')
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = process.env.MONGODB_URI;
// const connectMongo = async () => {
//   try {
//       await mongoose.connect(dbURI)
//       console.log('connected to mongodb');

//   } catch (error) {
//       console.log("couldn't connect mongo", error.message);

//   }
// }
app.listen(3000, () => {
  mongoose
    .connect(dbURI)
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.error("MongoDB connection error:", err));
  console.log(`server runnign on port 3000`);
});

// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
//   .then((result) => app.listen(3000))
//   .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.use(authRoutes);
app.use(requireAuth, userRoutes);
