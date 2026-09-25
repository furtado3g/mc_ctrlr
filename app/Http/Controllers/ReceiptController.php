<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditEvent;
use App\Http\Requests\ReceiptRequest;
use App\Models\CashMovement;
use App\Models\Receipt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReceiptController extends Controller
{
    public function store(ReceiptRequest $request, CashMovement $movement): RedirectResponse
    {
        $file = $request->file('receipt');
        $path = $file->store('movements', 'receipts');
        $old = $movement->receipt;
        Receipt::updateOrCreate(['cash_movement_id' => $movement->id], [
            'path' => $path, 'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(), 'size_bytes' => $file->getSize(),
            'uploaded_by' => $request->user()->id, 'uploaded_at' => now(),
        ]);
        app(RecordAuditEvent::class)->execute('cash_movement', $movement->id, 'receipt_upload', $old?->toArray(), ['name' => $file->getClientOriginalName()], $request->user()->id);
        if ($old) {
            Storage::disk('receipts')->delete($old->path);
        }

        return back();
    }

    public function show(CashMovement $movement): StreamedResponse
    {
        Gate::authorize('caixa.view');
        $receipt = $movement->receipt;
        abort_unless($receipt !== null, 404);

        return Storage::disk('receipts')->download($receipt->path, $receipt->original_name);
    }
}
