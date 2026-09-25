import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentController::store
* @see app/Http/Controllers/PaymentController.php:14
* @route '/fees/{fee}/payments'
*/
export const store = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/fees/{fee}/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::store
* @see app/Http/Controllers/PaymentController.php:14
* @route '/fees/{fee}/payments'
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
* @see \App\Http\Controllers\PaymentController::store
* @see app/Http/Controllers/PaymentController.php:14
* @route '/fees/{fee}/payments'
*/
store.post = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::store
* @see app/Http/Controllers/PaymentController.php:14
* @route '/fees/{fee}/payments'
*/
const storeForm = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::store
* @see app/Http/Controllers/PaymentController.php:14
* @route '/fees/{fee}/payments'
*/
storeForm.post = (args: { fee: number | { id: number } } | [fee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PaymentController::reverse
* @see app/Http/Controllers/PaymentController.php:26
* @route '/payments/{payment}/reverse'
*/
export const reverse = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/payments/{payment}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::reverse
* @see app/Http/Controllers/PaymentController.php:26
* @route '/payments/{payment}/reverse'
*/
reverse.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return reverse.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::reverse
* @see app/Http/Controllers/PaymentController.php:26
* @route '/payments/{payment}/reverse'
*/
reverse.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::reverse
* @see app/Http/Controllers/PaymentController.php:26
* @route '/payments/{payment}/reverse'
*/
const reverseForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PaymentController::reverse
* @see app/Http/Controllers/PaymentController.php:26
* @route '/payments/{payment}/reverse'
*/
reverseForm.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

const PaymentController = { store, reverse }

export default PaymentController