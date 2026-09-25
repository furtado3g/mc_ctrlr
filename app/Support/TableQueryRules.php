<?php

namespace App\Support;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TableQueryRules
{
    /**
     * Query schema per table: permission area, allowed filters, sort columns and default.
     *
     * @return array{area: string, filters: array<string, array<int, string>>, sorts: list<string>, default_sort: string}
     */
    public function schema(string $table): array
    {
        $schemas = [
            'members' => ['area' => 'cadastros', 'filters' => ['status' => ['nullable', 'in:active,left']], 'sorts' => ['id', 'name', 'joined_at', 'status'], 'default_sort' => 'name'],
            'roles' => ['area' => 'cadastros', 'filters' => ['active' => ['nullable', 'boolean']], 'sorts' => ['id', 'name', 'sort_order', 'active'], 'default_sort' => 'sort_order'],
            'admin_users' => ['area' => 'administracao', 'filters' => ['active' => ['nullable', 'boolean']], 'sorts' => ['id', 'name', 'email', 'active'], 'default_sort' => 'name'],
            'periods' => ['area' => 'cobrancas', 'filters' => ['status' => ['nullable', 'in:open,closed']], 'sorts' => ['id', 'competence', 'due_at', 'status'], 'default_sort' => 'competence'],
            'fees' => ['area' => 'cobrancas', 'filters' => ['period' => ['nullable', 'integer', 'min:1'], 'status' => ['nullable', 'in:open,partial,paid,overdue']], 'sorts' => ['id', 'balance_cents', 'issued_amount_cents', 'due_at', 'member_name', 'competence'], 'default_sort' => 'id'],
            'cash' => ['area' => 'caixa', 'filters' => ['type' => ['nullable', 'in:in,out'], 'start' => ['nullable', 'date'], 'end' => ['nullable', 'date']], 'sorts' => ['id', 'occurred_at', 'type', 'amount_cents', 'category'], 'default_sort' => 'occurred_at'],
            'reports.fees' => ['area' => 'relatorios', 'filters' => ['start' => ['nullable', 'date'], 'end' => ['nullable', 'date'], 'overdue' => ['nullable', 'boolean']], 'sorts' => ['member', 'competence', 'due_at', 'status', 'balance_cents'], 'default_sort' => 'due_at'],
            'reports.cash' => ['area' => 'relatorios', 'filters' => ['start' => ['nullable', 'date'], 'end' => ['nullable', 'date'], 'type' => ['nullable', 'in:in,out']], 'sorts' => ['date', 'type', 'category', 'amount_cents'], 'default_sort' => 'date'],
            'reports.fiscal' => ['area' => 'relatorios', 'filters' => ['start' => ['nullable', 'date'], 'end' => ['nullable', 'date'], 'type' => ['nullable', 'in:in,out']], 'sorts' => ['date', 'type', 'category', 'amount_cents'], 'default_sort' => 'date'],
        ];

        if (! isset($schemas[$table])) {
            throw ValidationException::withMessages(['table' => 'Tabela não permitida.']);
        }

        return $schemas[$table];
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array{search: string, filters: array<string, mixed>, sort: string, direction: string, page: int, per_page: int}
     */
    public function normalize(string $table, array $input): array
    {
        $schema = $this->schema($table);
        $unknownFields = array_diff(array_keys($input), ['search', 'filters', 'sort', 'direction', 'page', 'per_page']);
        if ($unknownFields !== []) {
            throw ValidationException::withMessages(['query' => 'Um ou mais campos da consulta não são permitidos.']);
        }
        $rawFilters = $input['filters'] ?? [];
        $unknownFilters = is_array($rawFilters) ? array_diff(array_keys($rawFilters), array_keys($schema['filters'])) : [];
        if ($unknownFilters !== []) {
            throw ValidationException::withMessages(['filters' => 'Um ou mais filtros não são permitidos.']);
        }
        $rules = [
            'search' => ['nullable', 'string', 'max:120'],
            'filters' => ['nullable', 'array'],
            'sort' => ['nullable', 'string', Rule::in($schema['sorts'])],
            'direction' => ['nullable', 'in:asc,desc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', Rule::in([10, 30, 50])],
        ];
        foreach ($schema['filters'] as $filter => $filterRules) {
            $rules['filters.'.$filter] = $filterRules;
        }

        $validated = Validator::make($input, $rules)->validate();
        $filters = $validated['filters'] ?? [];
        if (isset($filters['start'], $filters['end']) && $filters['end'] < $filters['start']) {
            throw ValidationException::withMessages(['filters.end' => 'A data final deve ser igual ou posterior à data inicial.']);
        }

        return [
            'search' => trim((string) ($validated['search'] ?? '')),
            'filters' => array_filter($filters, static fn (mixed $value): bool => $value !== null && $value !== ''),
            'sort' => (string) ($validated['sort'] ?? $schema['default_sort']),
            'direction' => (string) ($validated['direction'] ?? 'asc'),
            'page' => (int) ($validated['page'] ?? 1),
            'per_page' => (int) ($validated['per_page'] ?? 30),
        ];
    }
}
