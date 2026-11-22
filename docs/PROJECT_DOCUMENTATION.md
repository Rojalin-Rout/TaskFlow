# TaskFlow — Project Documentation

## 1. Project overview
TaskFlow is a lightweight task management web app for individuals or small teams. It helps users capture tasks, set priority and due dates, track progress, and find work through search and filters.

## 2. Planning and approach
The assessment emphasizes a complete working application. The build is organized in three layers:
- React UI: interaction, forms, task presentation, filters, dashboard metrics.
- Express API: validation, HTTP routing, business operations, error responses.
- MySQL: durable task storage, timestamps, indexed filter fields.

## 3. User journey
1. Open the dashboard and review task counts.
2. Search or filter tasks to locate work.
3. Create a task with title, description, status, priority, and due date.
4. Open task details to review the full record.
5. Edit task information or update its status.
6. Delete a task when it is no longer needed.

## 4. Architecture
Browser (React/Vite) -- HTTP JSON --> Express REST API -- parameterized SQL --> MySQL

The UI does not access the database directly. All persistence goes through API endpoints, allowing backend validation and database credentials to stay out of the browser.

## 5. Database model
Table: `tasks`
| Field | Type | Notes |
|---|---|---|
| id | INT UNSIGNED | Primary key, auto-increment |
| title | VARCHAR(160) | Required |
| description | TEXT | Optional |
| status | ENUM | Pending, In Progress, Completed |
| priority | ENUM | Low, Medium, High |
| due_date | DATE | Optional |
| created_at | TIMESTAMP | Automatically assigned |
| updated_at | TIMESTAMP | Automatically updated |

Indexes support filtering by status, priority, and due date.

## 6. Validation and error handling
- Title is required and trimmed; maximum 160 characters.
- Status and priority values must be from supported enums.
- Due dates are validated for the expected YYYY-MM-DD format.
- SQL values use placeholders (prepared/parameterized queries).
- API responds with 400 for invalid input, 404 for missing records, and 500 for unexpected errors.
- Frontend shows loading, empty, and error feedback; action confirmation is used before deletion.

## 7. Manual test checklist
- [ ] Dashboard metrics load and match database records.
- [ ] Create a task with valid inputs.
- [ ] Reject a task with an empty title.
- [ ] View task details.
- [ ] Edit title and description.
- [ ] Change task status using the inline dropdown.
- [ ] Filter by status.
- [ ] Filter by priority.
- [ ] Search by title and description.
- [ ] Sort by due date.
- [ ] Delete task and verify it is removed.
- [ ] Refresh page and verify tasks persist.
- [ ] Check responsive behavior at mobile widths.

## 8. Limitations / future improvements
- Authentication, multi-user task ownership, and role permissions are not included.
- Add automated API tests and frontend tests.
- Add pagination for large task lists.
- Add task labels, recurring tasks, and drag-and-drop board view.
- Add deployment configuration and production environment hardening.
- Add timezone-aware date handling and stricter date validation.