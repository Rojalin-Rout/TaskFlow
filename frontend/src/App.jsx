import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock3,
  Filter,
  LayoutDashboard,
  ListTodo,
  Menu,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  Trash2,
  X,
  Pencil,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { api } from "./api";

const initialForm = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Medium",
  due_date: "",
};
const statuses = ["Pending", "In Progress", "Completed"];
const priorities = ["Low", "Medium", "High"];
const dateLabel = (value) =>
  value
    ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
    : "No due date";
const shortDate = (value) =>
  value
    ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
        },
      )
    : "No date";
function isOverdue(task) {
  return (
    task.due_date &&
    task.status !== "Completed" &&
    new Date(`${String(task.due_date).slice(0, 10)}T23:59:59`) < new Date()
  );
}
function StatusPill({ status }) {
  return (
    <span className={`status status-${status.toLowerCase().replace(" ", "-")}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}
function PriorityTag({ priority }) {
  return (
    <span className={`priority priority-${priority.toLowerCase()}`}>
      <span className="priority-mark" />
      {priority}
    </span>
  );
}
function StatCard({ title, value, label, icon: Icon, tone, trend }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="stat-meta">
        <span>{title}</span>
        <strong>{value ?? "—"}</strong>
        <small>{label}</small>
      </div>
      {trend && (
        <span className="stat-spark">
          <Sparkles size={15} />
        </span>
      )}
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);

  const query = useMemo(
    () => ({ search, status, priority, sort }),
    [search, status, priority, sort],
  );

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [list, summary] = await Promise.all([
        api.tasks(query),
        api.stats(),
      ]);
      setTasks(list);
      setStats(summary);
    } catch (e) {
      setError(
        e.message || "Could not load tasks. Check the API and database.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, [query]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  const openCreate = () => {
    setForm(initialForm);
    setModal({ mode: "create" });
  };
  const openEdit = (task) => {
    setForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ? String(task.due_date).slice(0, 10) : "",
    });
    setModal({ mode: "edit", task });
  };
  const openDetails = (task) => setModal({ mode: "details", task });
  async function saveTask(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (modal.mode === "create") await api.create(form);
      else await api.update(modal.task.id, form);
      setModal(null);
      setNotice(
        modal.mode === "create"
          ? "Task created successfully."
          : "Task updated successfully.",
      );
      await loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function deleteTask(task) {
    if (
      !window.confirm(`Delete "${task.title}"? This action cannot be undone.`)
    )
      return;
    try {
      await api.remove(task.id);
      setNotice("Task deleted.");
      setModal(null);
      await loadData();
    } catch (e) {
      setError(e.message);
    }
  }
  async function changeStatus(task, nextStatus) {
    try {
      await api.update(task.id, { status: nextStatus });
      setNotice("Task status updated.");
      await loadData();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-icon">
            <ClipboardList size={20} />
          </span>
          <span>
            Task<span className="brand-accent">Flow</span>
          </span>
        </div>
        <div className="workspace-switch">
          <div className="workspace-avatar">W</div>
          <div>
            <b>Workspace</b>
            <small>Personal space</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <button
          className={`nav-item ${activeNav === "Overview" ? "active" : ""}`}
          onClick={() => {
            setActiveNav("Overview");
            setMobileMenu(false);
          }}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button
          className={`nav-item ${activeNav === "All tasks" ? "active" : ""}`}
          onClick={() => {
            setActiveNav("All tasks");
            setStatus("");
            setMobileMenu(false);
          }}
        >
          <ListTodo size={18} /> All tasks{" "}
          <span className="nav-count">{stats.total}</span>
        </button>
        <button
          className={`nav-item status-nav-item ${activeNav === "Pending" ? "active" : ""}`}
          aria-current={activeNav === "Pending" ? "page" : undefined}
          onClick={() => {
            setStatus("Pending");
            setActiveNav("Pending");
            setMobileMenu(false);
          }}
        >
          <Circle size={17} /> Pending
        </button>
        <button
          className={`nav-item status-nav-item ${activeNav === "In Progress" ? "active" : ""}`}
          aria-current={activeNav === "In Progress" ? "page" : undefined}
          onClick={() => {
            setStatus("In Progress");
            setActiveNav("In Progress");
            setMobileMenu(false);
          }}
        >
          <Activity size={17} /> In progress
        </button>
        <button
          className={`nav-item status-nav-item ${activeNav === "Completed" ? "active" : ""}`}
          aria-current={activeNav === "Completed" ? "page" : undefined}
          onClick={() => {
            setStatus("Completed");
            setActiveNav("Completed");
            setMobileMenu(false);
          }}
        >
          <CheckCircle2 size={17} /> Completed
        </button>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">
              <Sparkles size={16} />
            </div>
            <b>Keep your focus</b>
            <p>Small steps add up. Pick one task and make progress.</p>
            <button onClick={openCreate}>+ Add a task</button>
          </div>
          <div className="user-profile">
            <div className="profile-avatar">Y</div>
            <div>
              <b>Your workspace</b>
              <small>Personal account</small>
            </div>
            <Settings2 size={17} />
          </div>
        </div>
      </aside>
      {mobileMenu && (
        <div className="sidebar-overlay" onClick={() => setMobileMenu(false)} />
      )}
      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <b>{activeNav}</b>
          </div>
          <div className="top-actions">
            <span className="today">
              <CalendarDays size={15} />
              {new Date().toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <div className="top-avatar">Y</div>
          </div>
        </header>
        <div className="content">
          <section className="welcome">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} /> YOUR PRODUCTIVITY SPACE
              </div>
              <h1>
                Good things happen
                <br className="mobile-break" /> when you{" "}
                <span>get things done.</span>
              </h1>
              <p>
                Stay organized, focus on what matters, and keep your momentum
                going.
              </p>
            </div>
            <div className="welcome-art">
              <div className="art-circle">
                <div className="art-note note-one">
                  <CheckCircle2 size={16} /> Task completed
                </div>
                <div className="art-check">
                  <Check size={34} />
                </div>
                <div className="art-note note-two">
                  <Target size={15} /> Focus on goals
                </div>
              </div>
            </div>
          </section>
          <div className="section-heading">
            <div>
              <h2>Your overview</h2>
              <p>A snapshot of your work today.</p>
            </div>
            <button className="primary-button" onClick={openCreate}>
              <Plus size={17} /> New task
            </button>
          </div>
          <section className="stats-grid">
            <StatCard
              title="Total tasks"
              value={stats.total}
              label="Across your workspace"
              icon={ClipboardList}
              tone="violet"
              trend
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              label="Waiting to be started"
              icon={Clock3}
              tone="amber"
            />
            <StatCard
              title="In progress"
              value={stats.inProgress}
              label="Currently working on"
              icon={Activity}
              tone="blue"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              label="You've made progress"
              icon={CheckCircle2}
              tone="green"
            />
          </section>
          <section className="tasks-panel">
            <div className="task-panel-head">
              <div>
                <h2
                  className={`task-heading ${status ? `task-heading-${status.toLowerCase().replace(" ", "-")}` : "task-heading-all"}`}
                >
                  {status || "All tasks"}
                </h2>
                <p>Manage and track your tasks in one place.</p>
              </div>
              <span className="task-total">{tasks.length} tasks</span>
            </div>
            <div className="filters">
              <div className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="filter-select">
                <Filter size={15} />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">All priorities</option>
                  {priorities.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="filter-select">
                <ArrowDownUp size={15} />
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="due_soon">Due date</option>
                </select>
              </div>
              {status && (
                <button
                  className="clear-filter"
                  onClick={() => {
                    setStatus("");
                    setActiveNav("All tasks");
                  }}
                >
                  Clear status <X size={13} />
                </button>
              )}
            </div>
            {error && (
              <div className="error-banner">
                <AlertCircle size={17} />
                {error}
                <button onClick={() => setError("")}>
                  <X size={15} />
                </button>
              </div>
            )}
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <span>Loading your tasks…</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <ListTodo size={25} />
                </div>
                <h3>No tasks found</h3>
                <p>
                  {search || status || priority
                    ? "Try adjusting your search or filters."
                    : "Create your first task to get started."}
                </p>
                {!search && !status && !priority && (
                  <button className="primary-button" onClick={openCreate}>
                    <Plus size={16} /> Create task
                  </button>
                )}
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <article className="task-row" key={task.id}>
                    <button
                      className={`task-check ${task.status === "Completed" ? "checked" : ""}`}
                      aria-label="Mark task completed"
                      onClick={() =>
                        changeStatus(
                          task,
                          task.status === "Completed" ? "Pending" : "Completed",
                        )
                      }
                    >
                      {task.status === "Completed" && <Check size={14} />}
                    </button>
                    <div
                      className="task-main"
                      onClick={() => openDetails(task)}
                    >
                      <h3
                        className={
                          task.status === "Completed" ? "task-done" : ""
                        }
                      >
                        {task.title}
                      </h3>
                      <p>{task.description || "No description provided."}</p>
                      <div className="task-meta">
                        <StatusPill status={task.status} />
                        <PriorityTag priority={task.priority} />
                        <span
                          className={`due ${isOverdue(task) ? "overdue" : ""}`}
                        >
                          <CalendarDays size={14} />
                          {shortDate(task.due_date)}
                          {isOverdue(task) && <b>Overdue</b>}
                        </span>
                      </div>
                    </div>
                    <div className="task-actions">
                      <select
                        aria-label="Change task status"
                        value={task.status}
                        onChange={(e) => changeStatus(task, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <button title="Edit task" onClick={() => openEdit(task)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Delete task"
                        onClick={() => deleteTask(task)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <footer className="footer">
            <span>
              Made for focused work <span>✦</span>
            </span>
            <span>TaskFlow · Keep moving forward</span>
          </footer>
        </div>
      </main>
      {notice && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal">
            <div className="modal-head">
              <div>
                <span className="modal-eyebrow">
                  {modal.mode === "create"
                    ? "NEW TASK"
                    : modal.mode === "edit"
                      ? "EDIT TASK"
                      : "TASK DETAILS"}
                </span>
                <h2>
                  {modal.mode === "create"
                    ? "Create a task"
                    : modal.mode === "edit"
                      ? "Update task"
                      : "Task details"}
                </h2>
              </div>
              <button className="close-button" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>
            {modal.mode === "details" ? (
              <div className="detail-content">
                <h3>{modal.task.title}</h3>
                <p>{modal.task.description || "No description provided."}</p>
                <div className="detail-grid">
                  <div>
                    <small>Status</small>
                    <StatusPill status={modal.task.status} />
                  </div>
                  <div>
                    <small>Priority</small>
                    <PriorityTag priority={modal.task.priority} />
                  </div>
                  <div>
                    <small>Due date</small>
                    <span>{dateLabel(modal.task.due_date)}</span>
                  </div>
                  <div>
                    <small>Created</small>
                    <span>{dateLabel(modal.task.created_at)}</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    className="secondary-button"
                    onClick={() => openEdit(modal.task)}
                  >
                    <Pencil size={15} /> Edit task
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => deleteTask(modal.task)}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveTask} className="task-form">
                <label>
                  <span>Task title<em>*</em></span>
                  <input
                    autoFocus
                    maxLength={160}
                    required
                    placeholder="e.g. Review project proposal"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows={4}
                    placeholder="Add some details about this task…"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </label>
                <div className="form-grid">
                  <label>
                    Status
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Priority
                    <select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
                    >
                      {priorities.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Due date
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) =>
                      setForm({ ...form, due_date: e.target.value })
                    }
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>
                  <button className="primary-button" disabled={saving}>
                    {saving
                      ? "Saving…"
                      : modal.mode === "create"
                        ? "Create task"
                        : "Save changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
