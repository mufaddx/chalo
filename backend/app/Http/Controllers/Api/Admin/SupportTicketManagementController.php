<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupportTicketManagementController extends Controller
{
    public function index(Request $request)
    {
        return SupportTicket::with(['user', 'assignee', 'replies'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('priority'), fn ($q, $priority) => $q->where('priority', $priority))
            ->latest()
            ->paginate(20);
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['open', 'in_progress', 'resolved', 'closed'])],
        ]);

        $ticket->update($data);

        return $ticket->load(['user', 'assignee']);
    }

    public function assign(Request $request, SupportTicket $ticket)
    {
        $data = $request->validate(['assigned_to' => ['required', 'integer', 'exists:users,id']]);

        $ticket->update($data);

        return $ticket->load(['user', 'assignee']);
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $data = $request->validate(['message' => ['required', 'string', 'max:2000']]);

        $reply = $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $data['message'],
        ]);

        if ($ticket->status === 'open') {
            $ticket->update(['status' => 'in_progress']);
        }

        return response()->json($reply->load('user'), 201);
    }
}
