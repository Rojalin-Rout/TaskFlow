CREATE DATABASE IF NOT EXISTS taskflow_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskflow_db;

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT NULL,
  status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  due_date DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority),
  INDEX idx_tasks_due_date (due_date)
) ENGINE=InnoDB;

INSERT INTO tasks (title, description, status, priority, due_date)
SELECT 'Plan weekly goals', 'Review priorities and plan the most important outcomes for this week.', 'Pending', 'High', DATE_ADD(CURDATE(), INTERVAL 2 DAY)
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Plan weekly goals');

INSERT INTO tasks (title, description, status, priority, due_date)
SELECT 'Prepare project wireframes', 'Draft the main screens and review the user flow before implementation.', 'In Progress', 'Medium', DATE_ADD(CURDATE(), INTERVAL 4 DAY)
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Prepare project wireframes');

INSERT INTO tasks (title, description, status, priority, due_date)
SELECT 'Organize workspace', 'Clean up project folders and archive old notes.', 'Completed', 'Low', DATE_SUB(CURDATE(), INTERVAL 1 DAY)
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Organize workspace');
