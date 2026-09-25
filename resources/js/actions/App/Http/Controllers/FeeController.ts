import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FeeController::index
* @see app/Http/Controllers/FeeController.php:12
* @route '/fees'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/fees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FeeController::index
* @see app/Http/Controllers/FeeController.php:12
* @route '/fees'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeeController::index
* @see app/Http/Controllers/FeeController.php:12
* @route '/fees'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FeeController::index
* @see app/Http/Controllers/FeeController.php:12
* @route '/fees'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FeeController::index
* @see app/Http/Controllers/FeeController.php:12
* @route '/fees'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FeeController::index
* @see app/Http/Controllers/FeeController.php:12
* @route '/fees'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FeeController::index
* @see app/Http/Controllers/FeeController.php:12
* @route '/fees'
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
* @see \App\Http\Controllers\FeeController::show
* @see app/Http/Controllers/FeeController.php:22
* @route '/fees/{fee}'
*/
export const show = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/fees/{fee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FeeController::show
* @see app/Http/Controllers/FeeController.php:22
* @route '/fees/{fee}'
*/
show.url = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fee: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fee: typeof args.fee === 'object'
        ? args.fee.id
        : args.fee,
    }

    return show.definition.url
            .replace('{fee}', parsedArgs.fee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeeController::show
* @see app/Http/Controllers/FeeController.php:22
* @route '/fees/{fee}'
*/
show.get = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FeeController::show
* @see app/Http/Controllers/FeeController.php:22
* @route '/fees/{fee}'
*/
show.head = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FeeController::show
* @see app/Http/Controllers/FeeController.php:22
* @route '/fees/{fee}'
*/
const showForm = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FeeController::show
* @see app/Http/Controllers/FeeController.php:22
* @route '/fees/{fee}'
*/
showForm.get = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FeeController::show
* @see app/Http/Controllers/FeeController.php:22
* @route '/fees/{fee}'
*/
showForm.head = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const FeeController = { index, show }

export default FeeController