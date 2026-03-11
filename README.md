# Employee Task Management App

This is a Laravel & React-based application for managing employee check-ins, task submissions, and manager approvals. The app allows employees to submit tasks, update completion status, and allows managers to approve or disapprove tasks with remarks.

---

## Features

- Employee check-in/check-out system
- Task submission and tracking
- Carry-over of incomplete tasks to next day
- Manager approval workflow with remarks
- Bulk approve/disapprove tasks
- Real-time task status updates
- Responsive UI with DataTable for task listing

---

## Installation

Follow these steps to set up the application locally.

### 1. Clone the Repository
```bash
git clone https://github.com/pratishma09/event-management.git
cd event-management
```

### 2. Install Backend Dependencies

```bash
composer install
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit the `.env` file to configure your database connection and other settings.

### 5. Run Database Migrations

```bash
php artisan migrate
```

### 6. Build Frontend Assets

```bash
npm run dev
```

### 7. Start Development Server

```bash
php artisan serve
```

The app will be available at `http://127.0.0.1:8000`.

---

## Usage

### Employee Workflow

1. Check in at the start of the day.
2. Add tasks for the day.
3. Update task status if manager approved.
4. Check out at the end of the day.
5. Incomplete tasks are carried over to the next day automatically.

### Manager Workflow

1. View pending tasks submitted by employees.
2. Approve or disapprove tasks.
3. Add remarks for disapproved tasks.
4. Employees can edit disapproved tasks and resubmit.

