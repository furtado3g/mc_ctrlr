import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FeeGenerationController::store
* @see app/Http/Controllers/FeeGenerationController.php:12
* @route '/billing-periods/{period}/generate'
*/
export const store = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/billing-periods/{period}/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FeeGenerationController::store
* @see app/Http/Controllers/FeeGenerationController.php:12
* @route '/billing-periods/{period}/generate'
*/
store.url = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { period: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            period: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        period: typeof args.period === 'object'
        ? args.period.id
        : args.period,
    }

    return store.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeeGenerationController::store
* @see app/Http/Controllers/FeeGenerationController.php:12
* @route '/billing-periods/{period}/generate'
*/
store.post = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeeGenerationController::store
* @see app/Http/Controllers/FeeGenerationController.php:12
* @route '/billing-periods/{period}/generate'
*/
const storeForm = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeeGenerationController::store
* @see app/Http/Controllers/FeeGenerationController.php:12
* @route '/billing-periods/{period}/generate'
*/
storeForm.post = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const FeeGenerationController = { store }

export default FeeGenerationController