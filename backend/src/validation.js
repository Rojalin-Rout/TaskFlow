const statuses = ["Pending", "In Progress", "Completed"];
const priorities = ["Low", "Medium", "High"];

function validateTask(body, partial = false) {
  const errors = {};
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim())
      errors.title = "Task title is required.";
    else if (body.title.trim().length > 160)
      errors.title = "Title must be 160 characters or fewer.";
  }
  if (body.description !== undefined && typeof body.description !== "string")
    errors.description = "Description must be text.";
  if (body.status !== undefined && !statuses.includes(body.status))
    errors.status = "Choose a valid status.";
  if (body.priority !== undefined && !priorities.includes(body.priority))
    errors.priority = "Choose a valid priority.";
  if (
    body.due_date !== undefined &&
    body.due_date !== null &&
    body.due_date !== ""
  ) {
    const date = String(body.due_date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))
      errors.due_date = "Due date must be YYYY-MM-DD.";
  }
  return errors;
}
module.exports = { validateTask, statuses, priorities };
