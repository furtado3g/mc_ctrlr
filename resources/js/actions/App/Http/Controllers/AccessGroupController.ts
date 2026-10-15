import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AccessGroupController::index
* @see app/Http/Controllers/AccessGroupController.php:22
* @route '/access-groups'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/access-groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AccessGroupController::index
* @see app/Http/Controllers/AccessGroupController.php:22
* @route '/access-groups'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccessGroupController::index
* @see app/Http/Controllers/AccessGroupController.php:22
* @route '/access-groups'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccessGroupController::index
* @see app/Http/Controllers/AccessGroupController.php:22
* @route '/access-groups'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AccessGroupController::index
* @see app/Http/Controllers/AccessGroupController.php:22
* @route '/access-groups'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccessGroupController::index
* @see app/Http/Controllers/AccessGroupController.php:22
* @route '/access-groups'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccessGroupController::index
* @see app/Http/Controllers/AccessGroupController.php:22
* @route '/access-groups'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\AccessGroupController::store
* @see app/Http/Controllers/AccessGroupController.php:35
* @route '/access-groups'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/access-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AccessGroupController::store
* @see app/Http/Controllers/AccessGroupController.php:35
* @route '/access-groups'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccessGroupController::store
* @see app/Http/Controllers/AccessGroupController.php:35
* @route '/access-groups'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccessGroupController::store
* @see app/Http/Controllers/AccessGroupController.php:35
* @route '/access-groups'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccessGroupController::store
* @see app/Http/Controllers/AccessGroupController.php:35
* @route '/access-groups'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AccessGroupController::update
* @see app/Http/Controllers/AccessGroupController.php:48
* @route '/access-groups/{group}'
*/
export const update = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/access-groups/{group}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AccessGroupController::update
* @see app/Http/Controllers/AccessGroupController.php:48
* @route '/access-groups/{group}'
*/
update.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return update.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccessGroupController::update
* @see app/Http/Controllers/AccessGroupController.php:48
* @route '/access-groups/{group}'
*/
update.patch = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AccessGroupController::update
* @see app/Http/Controllers/AccessGroupController.php:48
* @route '/access-groups/{group}'
*/
const updateForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccessGroupController::update
* @see app/Http/Controllers/AccessGroupController.php:48
* @route '/access-groups/{group}'
*/
updateForm.patch = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\AccessGroupController::destroy
* @see app/Http/Controllers/AccessGroupController.php:65
* @route '/access-groups/{group}'
*/
export const destroy = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/access-groups/{group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AccessGroupController::destroy
* @see app/Http/Controllers/AccessGroupController.php:65
* @route '/access-groups/{group}'
*/
destroy.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return destroy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccessGroupController::destroy
* @see app/Http/Controllers/AccessGroupController.php:65
* @route '/access-groups/{group}'
*/
destroy.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AccessGroupController::destroy
* @see app/Http/Controllers/AccessGroupController.php:65
* @route '/access-groups/{group}'
*/
const destroyForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccessGroupController::destroy
* @see app/Http/Controllers/AccessGroupController.php:65
* @route '/access-groups/{group}'
*/
destroyForm.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\AccessGroupController::associateRole
* @see app/Http/Controllers/AccessGroupController.php:80
* @route '/club-roles/{role}/access-group'
*/
export const associateRole = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: associateRole.url(args, options),
    method: 'patch',
})

associateRole.definition = {
    methods: ["patch"],
    url: '/club-roles/{role}/access-group',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AccessGroupController::associateRole
* @see app/Http/Controllers/AccessGroupController.php:80
* @route '/club-roles/{role}/access-group'
*/
associateRole.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return associateRole.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccessGroupController::associateRole
* @see app/Http/Controllers/AccessGroupController.php:80
* @route '/club-roles/{role}/access-group'
*/
associateRole.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: associateRole.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AccessGroupController::associateRole
* @see app/Http/Controllers/AccessGroupController.php:80
* @route '/club-roles/{role}/access-group'
*/
const associateRoleForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: associateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccessGroupController::associateRole
* @see app/Http/Controllers/AccessGroupController.php:80
* @route '/club-roles/{role}/access-group'
*/
associateRoleForm.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: associateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

associateRole.form = associateRoleForm

const AccessGroupController = { index, store, update, destroy, associateRole }

export default AccessGroupController