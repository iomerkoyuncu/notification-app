const asyncHandler = require("express-async-handler")
const pool = require("../config/db")

// @desc  Create Notification
// @route POST /api/notifications
// @access Public

const createNotification = asyncHandler(async (req, res) => {
    const { message, expiry_date } = req.body

    const newNotification = await pool.query("INSERT INTO notifications (message, expiry_date) VALUES ($1, $2) RETURNING *", [message, expiry_date])

    res.json(newNotification.rows[0])
})

// @desc  Get all Notifications
// @route GET /api/notifications
// @access Public

const getNotifications = asyncHandler(async (req, res) => {
    const allNotifications = await pool.query("SELECT * FROM notifications")
    res.json(allNotifications.rows)
})

// @desc  Get a Notification
// @route GET /api/notifications/:id
// @access Public

const getNotification = asyncHandler(async (req, res) => {
    const { id } = req.params
    const notification = await pool.query("SELECT * FROM notifications WHERE notification_id = $1", [id])
    res.json(notification.rows[0])
})

// @desc  Update a Notification
// @route PUT /api/notifications/:id
// @access Public

const updateNotification = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { message, expiry_date } = req.body

    const notification = await pool.query("UPDATE notifications SET message = $1, expiry_date = $2 WHERE notification_id = $3 RETURNING *", [message, expiry_date, id])

    res.json(notification.rows[0])
})

// @desc  Delete a Notification
// @route DELETE /api/notifications/:id
// @access Public

const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params
    const notification = await pool.query("DELETE FROM notifications WHERE notification_id = $1", [id])
    res.json("Notification was deleted")
})

// @desc  Get all Expired Notifications
// @route GET /api/notifications/expired
// @access Public

const getExpiredNotifications = asyncHandler(async (req, res) => {
    const allExpiredNotifications = await pool.query("SELECT * FROM expired_notifications")
    res.json(allExpiredNotifications.rows)
})


module.exports = {
    createNotification,
    getNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
    getExpiredNotifications
}