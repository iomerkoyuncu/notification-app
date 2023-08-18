const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const dayjs = require('dayjs')
const pool = require('./config/db')
const server = http.createServer(app)
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const scheduler = new ToadScheduler()

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
}).listen(3002, () => {
  console.log('Socket.io listening on port 3002')
})

let notificationStack = [] // Maintain a stack of notifications
let checkForNotifications = true
const checkForSeconds = 5

// Function to handle expired notifications
const handleExpiredNotifications = async () => {
  try {
    if (notificationStack.length === 0) {
      console.log('No expired notifications in the stack')
      return
    }

    // Get the latest notification from the stack
    const notification = notificationStack.pop()

    // Emit the notification via socket.io
    await io.emit('notification', notification)

    // Remove the notification from the database
    await pool.query('DELETE FROM notifications WHERE notification_id = $1', [
      notification.notification_id,
    ])

    // Insert the notification into the expired_notifications table
    await pool.query(
      'INSERT INTO expired_notifications (message, expiry_date) VALUES ($1, $2)',
      [notification.message, notification.expiry_date]
    )

    console.log('Expired notification processed:', notification)

    // Continue processing any remaining notifications
    if (notificationStack.length > 0) {
      handleExpiredNotifications()
    } else {
      scheduler.addSimpleIntervalJob(job)
    }
  } catch (error) {
    console.error('Error handling notification:', error)
  }
}

const task = new Task('Check db for notification', async () => {
  try {
    const notifications = await pool.query(
      'SELECT * FROM notifications WHERE expiry_date >= $1',
      [dayjs().format('YYYY-MM-DD HH:mm:ss')]
    )

    if (notifications.rows.length > 0) {
      checkForNotifications = false

      const nextNotification = await pool.query(
        'SELECT * FROM notifications WHERE expiry_date >= $1 ORDER BY expiry_date DESC LIMIT 1',
        [dayjs().format('YYYY-MM-DD HH:mm:ss')]
      )

      console.log('Found notifications to process')
      scheduler.stop()
      console.log('Scheduler stopped!')

      const nextNotificationExpiryDate = nextNotification.rows[0].expiry_date
      const nextNotificationExpiryDateUnix = dayjs(
        nextNotificationExpiryDate
      ).unix()
      const currentTimeUnix = dayjs().unix()
      const timeDifference = nextNotificationExpiryDateUnix - currentTimeUnix

      console.log(
        'Next notification will be processed in',
        timeDifference,
        'seconds'
      )

      // Push the new notifications onto the stack
      notificationStack.push(...notifications.rows)

      setTimeout(() => {
        console.log('Found Notification!')

        handleExpiredNotifications(nextNotification.rows[0])
      }, timeDifference * 1000)
    } else {
      checkForNotifications = true
      console.log('No expired notifications to process')
    }
  } catch (error) {
    console.error('Error checking for notifications:', error)
  }
})

const job = new SimpleIntervalJob({ seconds: checkForSeconds }, task)

if (checkForNotifications) {
  scheduler.addSimpleIntervalJob(job)
}

const errorHandler = require('./middlewares/errorMiddleware')

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Notification API' })
})

//Routes
app.use('/api/notifications', require('./routes/notificationRoutes'))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
