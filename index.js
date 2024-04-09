const express = require("express");
const Redis = require("ioredis");
const cors = require("cors");
const { nanoid } = require("nanoid");
const morgan = require("morgan");

const redis = new Redis(6379, "redis");
// Check if Redis connection is successful
redis.on("ready", () => {
  console.log("Connected to Redis");
});

// Handle Redis connection errors
redis.on("error", (error) => {
  console.error("Error connecting to Redis:", error);
  process.exit(1); // Exit the process with an error code
});

const setData = async (data) => {
  const id = nanoid();
  await redis.set(`bin:${id}`, data, "EX", 36000);
  return id;
};

const getData = async (id) => {
  return await redis.get(`bin:${id}`);
};

const app = express();
const port = 3000;

app.set("trust proxy", 1); // Trust the first proxy

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

app.use((req, res, next) => {
  const protocol = req.get("X-Forwarded-Proto") || req.protocol;
  const host = req.get("X-Forwarded-Host") || req.get("host");
  const endpoint = `${protocol}://${host}`;
  console.log("host:", endpoint); // Use or log the full URL as needed
  app.locals.endpoint = endpoint;
  next();
});

app.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`go/${id}`);
  const data = await getData(id);
  res.header("Content-Type", "text/plain");
  res.send(data);
});

app.post("/set", async (req, res) => {
  const data = req.body.data;
  const id = await setData(data);
  res.send(`${app.locals.endpoint}/get/${id}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
