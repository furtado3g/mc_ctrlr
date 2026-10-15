import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::store
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:13
* @route '/me/profile/motorcycles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/me/profile/motorcycles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::store
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:13
* @route '/me/profile/motorcycles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::store
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:13
* @route '/me/profile/motorcycles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::store
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:13
* @route '/me/profile/motorcycles'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::store
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:13
* @route '/me/profile/motorcycles'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::update
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:20
* @route '/me/profile/motorcycles/{link}'
*/
export const update = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/me/profile/motorcycles/{link}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::update
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:20
* @route '/me/profile/motorcycles/{link}'
*/
update.url = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { link: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { link: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            link: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        link: typeof args.link === 'object'
        ? args.link.id
        : args.link,
    }

    return update.definition.url
            .replace('{link}', parsedArgs.link.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::update
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:20
* @route '/me/profile/motorcycles/{link}'
*/
update.patch = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::update
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:20
* @route '/me/profile/motorcycles/{link}'
*/
const updateForm = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::update
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:20
* @route '/me/profile/motorcycles/{link}'
*/
updateForm.patch = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MemberProfileMotorcycleController::destroy
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:28
* @route '/me/profile/motorcycles/{link}'
*/
export const destroy = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/me/profile/motorcycles/{link}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::destroy
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:28
* @route '/me/profile/motorcycles/{link}'
*/
destroy.url = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { link: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { link: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            link: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        link: typeof args.link === 'object'
        ? args.link.id
        : args.link,
    }

    return destroy.definition.url
            .replace('{link}', parsedArgs.link.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::destroy
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:28
* @route '/me/profile/motorcycles/{link}'
*/
destroy.delete = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::destroy
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:28
* @route '/me/profile/motorcycles/{link}'
*/
const destroyForm = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberProfileMotorcycleController::destroy
* @see app/Http/Controllers/MemberProfileMotorcycleController.php:28
* @route '/me/profile/motorcycles/{link}'
*/
destroyForm.delete = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const MemberProfileMotorcycleController = { store, update, destroy }

export default MemberProfileMotorcycleController