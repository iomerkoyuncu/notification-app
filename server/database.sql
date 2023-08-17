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
