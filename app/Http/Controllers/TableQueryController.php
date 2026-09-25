<?php

namespace App\Http\Controllers;

use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TableQueryController extends Controller
{
    public function update(Request $request, TableQueryRules $rules, SessionTableQuery $queries): RedirectResponse
    {
        $data = $request->validate(['table' => ['required', 'string', 'max:81'], 'query' => ['nullable', 'array'], 'clear' => ['sometimes', 'boolean']]);
        $table = $data['table'];
        $schema = $rules->schema($table);
        Gate::authorize($schema['area'].'.view');

        if (($data['clear'] ?? false) === true) {
            $queries->clear($request->user()->id, $table);
        } else {
            $queries->put($request->user()->id, $table, $rules->normalize($table, $data['query'] ?? []));
        }

        return back();
    }
}
