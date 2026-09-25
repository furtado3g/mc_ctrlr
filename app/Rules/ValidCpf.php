<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCpf implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! preg_match('/^\d{11}$/', $value) || preg_match('/^(\d)\1{10}$/', $value)) {
            $fail('Informe um CPF válido.');

            return;
        }

        $digits = array_map('intval', str_split($value));
        $first = $this->digit($digits, 9);
        $second = $this->digit($digits, 10);

        if ($digits[9] !== $first || $digits[10] !== $second) {
            $fail('Informe um CPF válido.');
        }
    }

    /** @param list<int> $digits */
    private function digit(array $digits, int $length): int
    {
        $sum = 0;
        for ($index = 0; $index < $length; $index++) {
            $sum += $digits[$index] * ($length + 1 - $index);
        }

        $remainder = $sum % 11;

        return $remainder < 2 ? 0 : 11 - $remainder;
    }
}
