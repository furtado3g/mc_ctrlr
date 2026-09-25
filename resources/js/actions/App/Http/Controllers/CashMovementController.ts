import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CashMovementController::store
* @see app/Http/Controllers/CashMovementController.php:12
* @route '/cash/movements'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cash/movements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CashMovementController::store
* @see app/Http/Controllers/CashMovementController.php:12
* @route '/cash/movements'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CashMovementController::store
* @see app/Http/Controllers/CashMovementController.php:12
* @route '/cash/movements'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CashMovementController::store
* @see app/Http/Controllers/CashMovementController.php:12
* @route '/cash/movements'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CashMovementController::store
* @see app/Http/Controllers/CashMovementController.php:12
* @route '/cash/movements'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CashMovementController::correct
* @see app/Http/Controllers/CashMovementController.php:24
* @route '/cash/movements/{movement}/corrections'
*/
export const correct = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: correct.url(args, options),
    method: 'post',
})

correct.definition = {
    methods: ["post"],
    url: '/cash/movements/{movement}/corrections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CashMovementController::correct
* @see app/Http/Controllers/CashMovementController.php:24
* @route '/cash/movements/{movement}/corrections'
*/
correct.url = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return correct.definition.url
            .replace('{movement}', parsedArgs.movement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CashMovementController::correct
* @see app/Http/Controllers/CashMovementController.php:24
* @route '/cash/movements/{movement}/corrections'
*/
correct.post = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: correct.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CashMovementController::correct
* @see app/Http/Controllers/CashMovementController.php:24
* @route '/cash/movements/{movement}/corrections'
*/
const correctForm = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: correct.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CashMovementController::correct
* @see app/Http/Controllers/CashMovementController.php:24
* @route '/cash/movements/{movement}/corrections'
*/
correctForm.post = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: correct.url(args, options),
    method: 'post',
})

correct.form = correctForm

/**
* @see \App\Http\Controllers\CashMovementController::reverse
* @see app/Http/Controllers/CashMovementController.php:37
* @route '/cash/movements/{movement}/reverse'
*/
export const reverse = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/cash/movements/{movement}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CashMovementController::reverse
* @see app/Http/Controllers/CashMovementController.php:37
* @route '/cash/movements/{movement}/reverse'
*/
reverse.url = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reverse.definition.url
            .replace('{movement}', parsedArgs.movement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CashMovementController::reverse
* @see app/Http/Controllers/CashMovementController.php:37
* @route '/cash/movements/{movement}/reverse'
*/
reverse.post = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CashMovementController::reverse
* @see app/Http/Controllers/CashMovementController.php:37
* @route '/cash/movements/{movement}/reverse'
*/
const reverseForm = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CashMovementController::reverse
* @see app/Http/Controllers/CashMovementController.php:37
* @route '/cash/movements/{movement}/reverse'
*/
reverseForm.post = (args: { movement: number | { id: number } } | [movement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

const CashMovementController = { store, correct, reverse }

export default CashMovementController