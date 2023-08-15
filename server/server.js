const express = require("express")
const app = express()
const cors = require("cors")

const errorHandler = require("./middlewares/errorMiddleware")

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Notification API" })
})

//Routes
app.use("/api/notifications", require("./routes/notificationRoutes"))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
