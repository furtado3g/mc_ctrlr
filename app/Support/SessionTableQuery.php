<?php

namespace App\Support;

use Illuminate\Support\Facades\Session;
use InvalidArgumentException;

class SessionTableQuery
{
    /**
     * @param  array<string, mixed>  $defaults
     * @return array<string, mixed>
     */
    public function get(int $userId, string $tableKey, array $defaults): array
    {
        $key = $this->key($userId, $tableKey);

        $stored = Session::get($key, []);
        unset($stored['updated_at']);

        return array_replace_recursive($defaults, $stored);
    }

    /**
     * @param  array<string, mixed>  $query
     */
    public function put(int $userId, string $tableKey, array $query): void
    {
        Session::put($this->key($userId, $tableKey), [...$query, 'updated_at' => now()->toIso8601String()]);
    }

    public function clear(int $userId, string $tableKey): void
    {
        Session::forget($this->key($userId, $tableKey));
    }

    private function key(int $userId, string $tableKey): string
    {
        if (! preg_match('/^[a-z][a-z0-9_.-]{0,80}$/', $tableKey)) {
            throw new InvalidArgumentException('Chave de tabela inválida.');
        }

        return 'table_queries.'.$userId.'.'.$tableKey;
    }
}
