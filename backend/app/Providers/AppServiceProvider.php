<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Task;
use App\Policies\CategoryPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Auth\Access\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {

    }
}
