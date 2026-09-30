<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class RegionalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null
            && $user->is_global
            && $user->canAccess('administracao', 'edit');
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $code = $this->input('code');
        $name = $this->input('name');
        $cities = $this->input('cities');

        if (is_array($cities)) {
            $normalizedCities = array_map(function ($city) {
                if (! is_array($city)) {
                    return $city;
                }

                return [
                    'id' => isset($city['id']) ? (int) $city['id'] : null,
                    'name' => isset($city['name']) ? trim((string) $city['name']) : '',
                    'state' => isset($city['state']) ? strtoupper(trim((string) $city['state'])) : '',
                    'is_headquarters' => filter_var($city['is_headquarters'] ?? false, FILTER_VALIDATE_BOOLEAN),
                ];
            }, $cities);
        } else {
            $normalizedCities = $cities;
        }

        $this->merge([
            'code' => $code ? strtoupper(trim((string) $code)) : null,
            'name' => $name ? trim((string) $name) : null,
            'cities' => $normalizedCities,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $regionalId = $this->route('regional') instanceof \App\Models\Regional
            ? $this->route('regional')->id
            : $this->route('regional');

        return [
            'name' => ['required', 'string', 'max:120'],
            'code' => ['required', 'string', 'max:20', Rule::unique('regionals', 'code')->ignore($regionalId)],
            'cities' => ['required', 'array', 'min:1'],
            'cities.*.id' => ['nullable', 'integer'],
            'cities.*.name' => ['required', 'string', 'max:120'],
            'cities.*.state' => ['required', 'string', 'size:2'],
            'cities.*.is_headquarters' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Custom validation logic.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $cities = $this->input('cities');
                if (! is_array($cities) || empty($cities)) {
                    return;
                }

                $headquartersCount = 0;
                $cityKeys = [];

                foreach ($cities as $index => $city) {
                    if (! is_array($city)) {
                        continue;
                    }

                    if (! empty($city['is_headquarters'])) {
                        $headquartersCount++;
                    }

                    $name = strtolower(trim((string) ($city['name'] ?? '')));
                    $state = strtoupper(trim((string) ($city['state'] ?? '')));
                    $key = "{$name}-{$state}";

                    if (! empty($name) && ! empty($state)) {
                        if (in_array($key, $cityKeys, true)) {
                            $validator->errors()->add("cities.{$index}.name", 'Não é permitido cadastrar a mesma cidade mais de uma vez nesta regional.');
                        } else {
                            $cityKeys[] = $key;
                        }
                    }
                }

                if ($headquartersCount !== 1) {
                    $validator->errors()->add('cities', 'Exatamente uma cidade deve ser selecionada como Sede da regional.');
                }
            },
        ];
    }
}
