const express = require("express")
const app = express()
const cors = require("cors")
const http = require("http")
const dayjs = require("dayjs")
const pool = require("./config/db")

const server = http.createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
}).listen(3002, () => {
  console.log("Socket.io listening on port 3002")
})



// Check for expired notifications every minute
const checkExpiredNotifications = async (socket) => {
  try {
    const currentTimestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const expiredNotifications = await pool.query("SELECT * FROM notifications WHERE expiry_date <= $1", [currentTimestamp]);

    await Promise.all(expiredNotifications.rows.map(async (notification) => {
      try {
        await io.emit("notification", notification);

        // Remove the notification from the database
        await pool.query("DELETE FROM notifications WHERE notification_id = $1", [notification.notification_id]);
        // Insert the notification into the expired_notifications table
        await pool.query("INSERT INTO expired_notifications (message, expiry_date) VALUES ($1, $2)", [notification.message, notification.expiry_date]);

      } catch (error) {
        console.error("Error handling notification:", error);
      }
    }));
  } catch (error) {
    console.error("Error checking expired notifications:", error);
  }
};

// Run the function every minute (adjust the interval as needed)
setInterval(checkExpiredNotifications, 1000);

const errorHandler = require("./middlewares/errorMiddleware")

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Notification API" })
})

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

//Routes
app.use("/api/notifications", require("./routes/notificationRoutes"))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
