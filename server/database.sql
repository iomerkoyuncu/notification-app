CREATE DATABASE notification_db;

CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  expiry_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE expired_notifications (
  notification_id SERIAL PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  expiry_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION notify_new_notification()
  RETURNS TRIGGER AS
$$
BEGIN
  -- The payload can be any JSON data you want to send with the notification
  PERFORM pg_notify('new_notification', '{"notification_id": ' || NEW.notification_id || '}');
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER new_notification_trigger
AFTER INSERT ON notifications
FOR EACH ROW
EXECUTE FUNCTION notify_new_notification();