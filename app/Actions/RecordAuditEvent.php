<?php

namespace App\Actions;

use App\Models\AuditEvent;

class RecordAuditEvent
{
    /**
     * @param  array<string, mixed>|null  $before
     * @param  array<string, mixed>|null  $after
     */
    public function execute(string $entity, int $id, string $action, ?array $before, ?array $after, ?int $userId): AuditEvent
    {
        return AuditEvent::create([
            'entity' => $entity,
            'entity_id' => $id,
            'action' => $action,
            'user_id' => $userId,
            'before' => $before,
            'after' => $after,
            'occurred_at' => now(),
        ]);
    }
}
