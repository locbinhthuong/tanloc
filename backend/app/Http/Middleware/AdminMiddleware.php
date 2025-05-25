<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user(); // Lấy user từ request (Sanctum sẽ kiểm tra token)

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập trang này.',
                'error' => 'Unauthorized'
            ], 403);
        }

        return $next($request);
    }
}
