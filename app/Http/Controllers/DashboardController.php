<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index()
    {
        $user = auth()->user();
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        $checkInToday = $user->checkIns()->where('date', $today)->first();

        if ($user->role === 'manager') {
            $pending = Task::whereHas('checkIn', function ($query) {
                    $query->where('tasks_submitted', false)
                          ->where('manager_status','pending');
                })
                ->with('checkIn.user')
                ->get();

            return Inertia::render('Dashboard', [
                'role' => 'manager',
                'pendingTasks' => $pending,
            ]);
        } else {
            $todayTasks = $checkInToday
                ? $checkInToday->tasks()->orderBy('date', 'desc')->get()
                : collect();

            $yesterdayTasks = $user->checkIns()
                ->where('date', $yesterday)
                ->first()?->tasks()
                ->where('completed', false)
                ->orderBy('date', 'desc')
                ->get() ?? collect();

            $tasks = $yesterdayTasks->concat($todayTasks);

            return Inertia::render('Dashboard', [
                'role' => 'employee',
                'checkIn' => $checkInToday,
                'tasks' => $tasks,
                'canSubmitTasks' => $checkInToday && !$checkInToday->tasks_submitted,
            ]);
        }
    }
}
