<?php

namespace App\Support;

class AccessPermissionCatalog
{
    /** @var list<string> */
    public const AREAS = ['cadastros', 'cobrancas', 'caixa', 'relatorios', 'administracao', 'institucional'];

    /** @var list<string> */
    public const ACTIONS = ['view', 'edit'];

    /** @var list<array{area: string, action: string, label: string}> */
    public const SPECIAL = [
        ['area' => 'membros', 'action' => 'edit_joined_at', 'label' => 'Alterar data de ingresso'],
    ];

    public static function allows(string $area, string $action): bool
    {
        if (in_array($area, self::AREAS, true) && in_array($action, self::ACTIONS, true)) {
            return true;
        }

        foreach (self::SPECIAL as $permission) {
            if ($permission['area'] === $area && $permission['action'] === $action) {
                return true;
            }
        }

        return false;
    }

    /** @return list<array{area: string, action: string, label: string}> */
    public static function special(): array
    {
        return self::SPECIAL;
    }
}
