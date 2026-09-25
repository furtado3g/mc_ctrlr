import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MemberMotorcycleController::store
* @see app/Http/Controllers/MemberMotorcycleController.php:14
* @route '/members/{member}/motorcycles'
*/
export const store = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/members/{member}/motorcycles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemberMotorcycleController::store
* @see app/Http/Controllers/MemberMotorcycleController.php:14
* @route '/members/{member}/motorcycles'
*/
store.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { member: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            member: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        member: typeof args.member === 'object'
        ? args.member.id
        : args.member,
    }

    return store.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberMotorcycleController::store
* @see app/Http/Controllers/MemberMotorcycleController.php:14
* @route '/members/{member}/motorcycles'
*/
store.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberMotorcycleController::store
* @see app/Http/Controllers/MemberMotorcycleController.php:14
* @route '/members/{member}/motorcycles'
*/
const storeForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberMotorcycleController::store
* @see app/Http/Controllers/MemberMotorcycleController.php:14
* @route '/members/{member}/motorcycles'
*/
storeForm.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MemberMotorcycleController::update
* @see app/Http/Controllers/MemberMotorcycleController.php:37
* @route '/member-motorcycles/{link}'
*/
export const update = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/member-motorcycles/{link}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemberMotorcycleController::update
* @see app/Http/Controllers/MemberMotorcycleController.php:37
* @route '/member-motorcycles/{link}'
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
* @see \App\Http\Controllers\MemberMotorcycleController::update
* @see app/Http/Controllers/MemberMotorcycleController.php:37
* @route '/member-motorcycles/{link}'
*/
update.patch = (args: { link: number | { id: number } } | [link: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MemberMotorcycleController::update
* @see app/Http/Controllers/MemberMotorcycleController.php:37
* @route '/member-motorcycles/{link}'
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
* @see \App\Http\Controllers\MemberMotorcycleController::update
* @see app/Http/Controllers/MemberMotorcycleController.php:37
* @route '/member-motorcycles/{link}'
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

const MemberMotorcycleController = { store, update }

export default MemberMotorcycleController