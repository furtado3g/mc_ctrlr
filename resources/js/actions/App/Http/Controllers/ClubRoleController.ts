import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClubRoleController::index
* @see app/Http/Controllers/ClubRoleController.php:12
* @route '/club-roles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/club-roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClubRoleController::index
* @see app/Http/Controllers/ClubRoleController.php:12
* @route '/club-roles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClubRoleController::index
* @see app/Http/Controllers/ClubRoleController.php:12
* @route '/club-roles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ClubRoleController::index
* @see app/Http/Controllers/ClubRoleController.php:12
* @route '/club-roles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ClubRoleController::index
* @see app/Http/Controllers/ClubRoleController.php:12
* @route '/club-roles'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ClubRoleController::index
* @see app/Http/Controllers/ClubRoleController.php:12
* @route '/club-roles'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ClubRoleController::index
* @see app/Http/Controllers/ClubRoleController.php:12
* @route '/club-roles'
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
* @see \App\Http\Controllers\ClubRoleController::store
* @see app/Http/Controllers/ClubRoleController.php:18
* @route '/club-roles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/club-roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClubRoleController::store
* @see app/Http/Controllers/ClubRoleController.php:18
* @route '/club-roles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClubRoleController::store
* @see app/Http/Controllers/ClubRoleController.php:18
* @route '/club-roles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClubRoleController::store
* @see app/Http/Controllers/ClubRoleController.php:18
* @route '/club-roles'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClubRoleController::store
* @see app/Http/Controllers/ClubRoleController.php:18
* @route '/club-roles'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ClubRoleController::update
* @see app/Http/Controllers/ClubRoleController.php:24
* @route '/club-roles/{role}'
*/
export const update = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/club-roles/{role}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClubRoleController::update
* @see app/Http/Controllers/ClubRoleController.php:24
* @route '/club-roles/{role}'
*/
update.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClubRoleController::update
* @see app/Http/Controllers/ClubRoleController.php:24
* @route '/club-roles/{role}'
*/
update.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ClubRoleController::update
* @see app/Http/Controllers/ClubRoleController.php:24
* @route '/club-roles/{role}'
*/
const updateForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClubRoleController::update
* @see app/Http/Controllers/ClubRoleController.php:24
* @route '/club-roles/{role}'
*/
updateForm.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const ClubRoleController = { index, store, update }

export default ClubRoleController