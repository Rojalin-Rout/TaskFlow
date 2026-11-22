# REST API

Base URL: `http://localhost:5000/api`

All request/response bodies use JSON.

## Health
`GET /health` — checks database connectivity.
Example response:
```json
{"success":true,"message":"API and database are healthy."}
```

## Tasks

### List/search/filter
`GET /tasks?search=design&status=Pending&priority=High&sort=due_soon`

Query parameters (all optional):
- `search`: searches title and description
- `status`: `Pending`, `In Progress`, `Completed`
- `priority`: `Low`, `Medium`, `High`
- `sort`: `newest` or `due_soon`

### Dashboard statistics
`GET /tasks/stats`

Example:
```json
{"total":6,"pending":2,"inProgress":2,"completed":2}
```

### Retrieve task
`GET /tasks/:id`
- `200` task object
- `404` not found

### Create task
`POST /tasks`
```json
{
  "title": "Review design",
  "description": "Collect feedback from the team",
  "status": "Pending",
  "priority": "High",
  "due_date": "2026-12-01"
}
```
Returns `201` with created task. Validation errors return `400`.

### Update task
`PUT /tasks/:id`
Partial updates are accepted; include only the fields you want to change.
```json
{"status":"In Progress","priority":"Medium"}
```
Returns `200` updated task; `404` if missing; `400` for invalid fields.

### Delete task
`DELETE /tasks/:id`
Returns:
```json
{"message":"Task deleted successfully."}
```
Returns `404` if missing.

## Error response
Validation example:
```json
{
  "message": "Please correct the task fields.",
  "errors": {"title": "Task title is required."}
}
```
Unexpected server errors return `500` with a generic message.