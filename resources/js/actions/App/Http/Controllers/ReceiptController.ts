import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReceiptController::store
* @see app/Http/Controllers/ReceiptController.php:13
* @route '/cash/movements/{movement}/receipt'
*/
export const store = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cash/movements/{movement}/receipt',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReceiptController::store
* @see app/Http/Controllers/ReceiptController.php:13
* @route '/cash/movements/{movement}/receipt'
*/
store.url = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { movement: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { movement: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            movement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        movement: typeof args.movement === 'object'
        ? args.movement.id
        : args.movement,
    }

    return store.definition.url
            .replace('{movement}', parsedArgs.movement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReceiptController::store
* @see app/Http/Controllers/ReceiptController.php:13
* @route '/cash/movements/{movement}/receipt'
*/
store.post = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReceiptController::store
* @see app/Http/Controllers/ReceiptController.php:13
* @route '/cash/movements/{movement}/receipt'
*/
const storeForm = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReceiptController::store
* @see app/Http/Controllers/ReceiptController.php:13
* @route '/cash/movements/{movement}/receipt'
*/
storeForm.post = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ReceiptController::show
* @see app/Http/Controllers/ReceiptController.php:27
* @route '/cash/movements/{movement}/receipt'
*/
export const show = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cash/movements/{movement}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReceiptController::show
* @see app/Http/Controllers/ReceiptController.php:27
* @route '/cash/movements/{movement}/receipt'
*/
show.url = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { movement: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { movement: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            movement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        movement: typeof args.movement === 'object'
        ? args.movement.id
        : args.movement,
    }

    return show.definition.url
            .replace('{movement}', parsedArgs.movement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReceiptController::show
* @see app/Http/Controllers/ReceiptController.php:27
* @route '/cash/movements/{movement}/receipt'
*/
show.get = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReceiptController::show
* @see app/Http/Controllers/ReceiptController.php:27
* @route '/cash/movements/{movement}/receipt'
*/
show.head = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReceiptController::show
* @see app/Http/Controllers/ReceiptController.php:27
* @route '/cash/movements/{movement}/receipt'
*/
const showForm = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReceiptController::show
* @see app/Http/Controllers/ReceiptController.php:27
* @route '/cash/movements/{movement}/receipt'
*/
showForm.get = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReceiptController::show
* @see app/Http/Controllers/ReceiptController.php:27
* @route '/cash/movements/{movement}/receipt'
*/
showForm.head = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const ReceiptController = { store, show }

export default ReceiptController