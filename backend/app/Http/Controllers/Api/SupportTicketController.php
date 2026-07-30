<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->supportTickets()
            ->with('replies.user')
            ->latest()
            ->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:180'],
            'message' => ['required', 'string', 'max:2000'],
            'category' => ['required', Rule::in(['booking', 'payment', 'agency', 'technical', 'other'])],
        ]);

        $ticket = $request->user()->supportTickets()->create([
            ...$data,
            'status' => 'open',
            'priority' => 'medium',
        ]);

        return response()->json($ticket, 201);
    }

    public function show(Request $request, SupportTicket $ticket)
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);

        return $ticket->load('replies.user');
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);

        $data = $request->validate(['message' => ['required', 'string', 'max:2000']]);

        $reply = $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $data['message'],
        ]);

        if ($ticket->status === 'resolved' || $ticket->status === 'closed') {
            $ticket->update(['status' => 'open']);
        }

        return response()->json($reply->load('user'), 201);
    }
}
