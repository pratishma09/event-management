<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('check_in_id')
                ->constrained('check_ins')
                ->cascadeOnDelete();

            $table->text('description');
            $table->date('date');

            $table->enum('manager_status', [
                'pending',
                'approved',
                'disapproved'
            ])->default('pending');

            $table->text('remarks')->nullable();

            $table->boolean('completed')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
