<?php

namespace App\Http\Controllers;

use App\Models\CheckIn;
use App\Models\Task;
use Illuminate\Http\Request;

class CheckInController extends Controller
{
    //
    public function checkIn()
    {
        $user = auth()->user();
        $today = now()->toDateString();

        if ($user->checkIns()->where('date', $today)->exists()) {
            return back()->withErrors(['message' => 'Already checked in today.']);
        }

        CheckIn::create([
            'user_id' => $user->id,
            'date' => $today,
            'check_in_time' => now(),
            'tasks_submitted' => false
        ]);

        return back();
    }
    public function addTasks(Request $request)
    {
        $request->validate([
            'tasks' => 'required|array|min:1',
            'tasks.*.description' => 'required|string'
        ]);

        $user = auth()->user();
        $today = now()->toDateString();

        $checkIn = $user->checkIns()
            ->where('date', $today)
            ->first();

        if (!$checkIn) {
            return back()->withErrors([
                'message' => 'Please check in first.'
            ]);
        }

        if ($checkIn->tasks_submitted) {
            return back()->withErrors([
                'message' => 'Task list already submitted.'
            ]);
        }

        $tasks = [];

        foreach ($request->tasks as $task) {
            $tasks[] = [
                'check_in_id' => $checkIn->id,
                'description' => $task['description'],
                'completed' => false,
                'date'=>$today,
                'manager_status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Task::insert($tasks);

        return back()->with('success', 'Tasks added successfully.');
    }


    public function completeTask(Task $task)
    {
        $checkIn = $task->checkIn;

        if ($checkIn->user_id !== auth()->id()) {
            abort(403);
        }

        if ($task->manager_status !== 'approved') {
            return back()->withErrors([
                'message' => 'You can only work after manager approval.'
            ]);
        }

        $task->update([
            'completed' => true
        ]);

        return back();
    }

    public function approveTasks(Request $request)
{
    if (auth()->user()->role !== 'manager') {
        abort(403);
    }

    $request->validate([
        'task_ids' => 'required|array|min:1',
        'task_ids.*' => 'exists:tasks,id'
    ]);

    Task::whereIn('id', $request->task_ids)
        ->update([
            'manager_status' => 'approved'
        ]);

    return back()->with('success', 'Selected tasks approved.');
}

    public function disapproveTasks(Request $request)
{
    if (auth()->user()->role !== 'manager') {
        abort(403);
    }

    $request->validate([
        'task_ids' => 'required|array|min:1',
        'task_ids.*' => 'exists:tasks,id',
        'remarks' => 'required|string'
    ]);

    Task::whereIn('id', $request->task_ids)
        ->update([
            'manager_status' => 'disapproved',
            'remarks' => $request->remarks
        ]);

    return back()->with('error', 'Selected tasks disapproved.');
}

    public function checkOut()
    {
        $user = auth()->user();
        $today = now()->toDateString();

        $checkIn = $user->checkIns()->where('date', $today)->first();

        if (!$checkIn || $checkIn->check_out_time) {
            return back()->withErrors(['message' => 'Cannot check out.']);
        }

        $checkIn->update([
            'check_out_time' => now(),
        ]);

        return back();
    }

    
    public function update(Request $request, Task $task)
{
    $task->update([
        'description' => $request->description,
        'remarks' => null,
        'manager_status' => 'pending'
    ]);

    return back();
}
}