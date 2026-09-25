import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FeeAdjustmentController::store
* @see app/Http/Controllers/FeeAdjustmentController.php:12
* @route '/fees/{fee}/adjustments'
*/
export const store = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/fees/{fee}/adjustments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FeeAdjustmentController::store
* @see app/Http/Controllers/FeeAdjustmentController.php:12
* @route '/fees/{fee}/adjustments'
*/
store.url = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{fee}', parsedArgs.fee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeeAdjustmentController::store
* @see app/Http/Controllers/FeeAdjustmentController.php:12
* @route '/fees/{fee}/adjustments'
*/
store.post = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeeAdjustmentController::store
* @see app/Http/Controllers/FeeAdjustmentController.php:12
* @route '/fees/{fee}/adjustments'
*/
const storeForm = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeeAdjustmentController::store
* @see app/Http/Controllers/FeeAdjustmentController.php:12
* @route '/fees/{fee}/adjustments'
*/
storeForm.post = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const FeeAdjustmentController = { store }

export default FeeAdjustmentController