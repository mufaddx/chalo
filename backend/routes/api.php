<?php

use App\Http\Controllers\Api\Admin\AgencyApprovalController;
use App\Http\Controllers\Api\Admin\BannerManagementController;
use App\Http\Controllers\Api\Admin\BlogManagementController;
use App\Http\Controllers\Api\Admin\BookingOverviewController;
use App\Http\Controllers\Api\Admin\CategoryManagementController;
use App\Http\Controllers\Api\Admin\CouponManagementController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\DestinationManagementController;
use App\Http\Controllers\Api\Admin\PageManagementController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\SupportTicketManagementController;
use App\Http\Controllers\Api\Admin\TourApprovalController;
use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\Agency\BookingManagementController;
use App\Http\Controllers\Api\Agency\TourManagementController;
use App\Http\Controllers\Api\AgencyController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CompareController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SupportTicketController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes — no auth required
|--------------------------------------------------------------------------
| Everything the public website (home, search, tour detail, agency
| profile) needs is unauthenticated, matching the frontend built in
| phase 1.
*/
Route::get('/tours', [TourController::class, 'index']);
Route::get('/tours/featured', [TourController::class, 'featured']);
Route::get('/tours/trending', [TourController::class, 'trending']);
Route::get('/tours/{tour:slug}', [TourController::class, 'show']);
Route::get('/tours/{tour:slug}/reviews', [ReviewController::class, 'indexForTour']);

Route::get('/agencies', [AgencyController::class, 'index']);
Route::get('/agencies/{agency:slug}', [AgencyController::class, 'show']);
Route::post('/agencies/register', [AgencyController::class, 'register']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/destinations', [DestinationController::class, 'index']);

Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog:slug}', [BlogController::class, 'show']);
Route::get('/pages/{page:slug}', [PageController::class, 'show']);
Route::get('/banners', [BannerController::class, 'index']);

// Booking creation is allowed as a guest (business rule allows a customer to
// book without an account, matching the "Enquiry" / "Book Now" flow), but the
// route still resolves an optional authenticated user via sanctum's
// stateful-or-token middleware upstream if a token is supplied.
Route::post('/tours/{tour:slug}/bookings', [BookingController::class, 'store']);

// Payment routes are guest-accessible for the same reason booking creation
// is — a customer who booked without an account still needs to pay. The
// booking's own unguessable numeric ID plus (in a real deployment) rate
// limiting is the practical protection here, same as most checkout flows.
Route::post('/bookings/{booking}/payment/create-order', [PaymentController::class, 'store']);
Route::post('/bookings/{booking}/payment/verify', [PaymentController::class, 'verify']);

// Server-to-server only. Its status payload is only used to trigger a
// server-side Transaction Enquiry re-check inside the controller, never
// trusted directly. Register this URL in the SabPaisa Dashboard's webhook
// settings.
Route::post('/webhooks/sabpaisa', [PaymentController::class, 'webhook']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'loginWithGoogle']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

/*
|--------------------------------------------------------------------------
| Authenticated customer routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::prefix('me')->group(function () {
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::get('/bookings/{booking}', [BookingController::class, 'show']);
        Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'requestCancellation']);

        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist/{tour:slug}', [WishlistController::class, 'store']);
        Route::delete('/wishlist/{tour:slug}', [WishlistController::class, 'destroy']);

        Route::get('/compare', [CompareController::class, 'index']);
        Route::post('/compare/{tour:slug}', [CompareController::class, 'store']);
        Route::delete('/compare/{tour:slug}', [CompareController::class, 'destroy']);
    });

    Route::post('/bookings/{booking}/review', [ReviewController::class, 'store']);

    Route::get('/me/support-tickets', [SupportTicketController::class, 'index']);
    Route::post('/me/support-tickets', [SupportTicketController::class, 'store']);
    Route::get('/me/support-tickets/{ticket}', [SupportTicketController::class, 'show']);
    Route::post('/me/support-tickets/{ticket}/replies', [SupportTicketController::class, 'reply']);

    /*
    |----------------------------------------------------------------------
    | Agency dashboard routes — every route here is scoped through
    | `$request->user()->agency` inside the controllers, which is what
    | actually enforces "agencies cannot see other agencies' data"
    | (business rule #8), not just the role check below.
    |----------------------------------------------------------------------
    */
    Route::middleware('role:agency')->prefix('agency')->group(function () {
        Route::get('/tours', [TourManagementController::class, 'index']);
        Route::post('/tours', [TourManagementController::class, 'store']);
        Route::put('/tours/{tour}', [TourManagementController::class, 'update']);
        Route::delete('/tours/{tour}', [TourManagementController::class, 'destroy']);
        Route::post('/tours/{tour}/duplicate', [TourManagementController::class, 'duplicate']);
        Route::post('/tours/{tour}/dates', [TourManagementController::class, 'addDate']);
        Route::patch('/tours/{tour}/dates/{tourDate}/close', [TourManagementController::class, 'closeDate']);

        Route::get('/bookings', [BookingManagementController::class, 'index']);
        Route::get('/bookings/export', [BookingManagementController::class, 'exportCsv']);
        Route::patch('/bookings/{booking}/status', [BookingManagementController::class, 'updateStatus']);

        Route::post('/reviews/{review}/reply', [ReviewController::class, 'reply']);
    });

    /*
    |----------------------------------------------------------------------
    | Super Admin routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        Route::get('/agencies', [AgencyApprovalController::class, 'index']);
        Route::post('/agencies/{agency}/approve', [AgencyApprovalController::class, 'approve']);
        Route::post('/agencies/{agency}/reject', [AgencyApprovalController::class, 'reject']);
        Route::post('/agencies/{agency}/suspend', [AgencyApprovalController::class, 'suspend']);

        Route::get('/tours', [TourApprovalController::class, 'index']);
        Route::post('/tours/{tour}/approve', [TourApprovalController::class, 'approve']);
        Route::post('/tours/{tour}/reject', [TourApprovalController::class, 'reject']);
        Route::patch('/tours/{tour}/featured', [TourApprovalController::class, 'toggleFeatured']);

        Route::get('/bookings', [BookingOverviewController::class, 'index']);

        Route::get('/users', [UserManagementController::class, 'index']);
        Route::patch('/users/{user}/toggle-active', [UserManagementController::class, 'toggleActive']);

        Route::get('/categories', [CategoryManagementController::class, 'index']);
        Route::post('/categories', [CategoryManagementController::class, 'store']);
        Route::put('/categories/{category}', [CategoryManagementController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryManagementController::class, 'destroy']);

        Route::get('/destinations', [DestinationManagementController::class, 'index']);
        Route::post('/destinations', [DestinationManagementController::class, 'store']);
        Route::put('/destinations/{destination}', [DestinationManagementController::class, 'update']);
        Route::delete('/destinations/{destination}', [DestinationManagementController::class, 'destroy']);

        Route::get('/coupons', [CouponManagementController::class, 'index']);
        Route::post('/coupons', [CouponManagementController::class, 'store']);
        Route::put('/coupons/{coupon}', [CouponManagementController::class, 'update']);
        Route::delete('/coupons/{coupon}', [CouponManagementController::class, 'destroy']);

        Route::get('/banners', [BannerManagementController::class, 'index']);
        Route::post('/banners', [BannerManagementController::class, 'store']);
        Route::put('/banners/{banner}', [BannerManagementController::class, 'update']);
        Route::delete('/banners/{banner}', [BannerManagementController::class, 'destroy']);

        Route::get('/blogs', [BlogManagementController::class, 'index']);
        Route::post('/blogs', [BlogManagementController::class, 'store']);
        Route::put('/blogs/{blog}', [BlogManagementController::class, 'update']);
        Route::delete('/blogs/{blog}', [BlogManagementController::class, 'destroy']);

        Route::get('/pages', [PageManagementController::class, 'index']);
        Route::post('/pages', [PageManagementController::class, 'store']);
        Route::put('/pages/{page}', [PageManagementController::class, 'update']);
        Route::delete('/pages/{page}', [PageManagementController::class, 'destroy']);

        Route::get('/settings', [SettingsController::class, 'index']);
        Route::put('/settings', [SettingsController::class, 'update']);

        Route::get('/support-tickets', [SupportTicketManagementController::class, 'index']);
        Route::patch('/support-tickets/{ticket}/status', [SupportTicketManagementController::class, 'updateStatus']);
        Route::patch('/support-tickets/{ticket}/assign', [SupportTicketManagementController::class, 'assign']);
        Route::post('/support-tickets/{ticket}/replies', [SupportTicketManagementController::class, 'reply']);
    });
});
