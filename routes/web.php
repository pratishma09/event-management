<?php

use App\Http\Controllers\CheckInController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Employee check-in
    Route::post('/check-in', [CheckInController::class, 'checkIn'])
        ->name('checkin.store');

    // Add tasks after check-in
    Route::post('/check-in/tasks', [CheckInController::class, 'addTasks'])
        ->name('checkin.tasks.store');

    // Mark task as completed
    Route::post('/tasks/{task}/complete', [CheckInController::class, 'completeTask'])
        ->name('tasks.complete');

    Route::post('/tasks/approve-bulk', [CheckInController::class, 'approveTasks'])
        ->name('tasks.approve.bulk');

    Route::post('/tasks/disapprove-bulk', [CheckInController::class, 'disapproveTasks'])
        ->name('tasks.disapprove.bulk');

    // Employee check-out
    Route::post('/check-out', [CheckInController::class, 'checkOut'])
        ->name('checkout.store');

        Route::post('/tasks/{task}/update', [CheckInController::class, 'update'])->name('tasks.update');
});

require __DIR__ . '/auth.php';
