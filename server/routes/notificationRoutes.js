const express = require("express")
const router = express.Router()
const {
    getNotifications,
    getNotification,
    createNotification,
    updateNotification,
    deleteNotification,
    getExpiredNotifications
} = require("../controllers/notificationController")

router.get("/", getNotifications)
router.post("/", createNotification)
router.get("/:id", getNotification)
router.put("/:id", updateNotification)
router.delete("/:id", deleteNotification)

router.get("/notification/expired", getExpiredNotifications)


module.exports = router