import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BillingPeriodController::index
* @see app/Http/Controllers/BillingPeriodController.php:12
* @route '/billing-periods'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/billing-periods',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingPeriodController::index
* @see app/Http/Controllers/BillingPeriodController.php:12
* @route '/billing-periods'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingPeriodController::index
* @see app/Http/Controllers/BillingPeriodController.php:12
* @route '/billing-periods'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::index
* @see app/Http/Controllers/BillingPeriodController.php:12
* @route '/billing-periods'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::index
* @see app/Http/Controllers/BillingPeriodController.php:12
* @route '/billing-periods'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::index
* @see app/Http/Controllers/BillingPeriodController.php:12
* @route '/billing-periods'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::index
* @see app/Http/Controllers/BillingPeriodController.php:12
* @route '/billing-periods'
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
* @see \App\Http\Controllers\BillingPeriodController::store
* @see app/Http/Controllers/BillingPeriodController.php:18
* @route '/billing-periods'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/billing-periods',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BillingPeriodController::store
* @see app/Http/Controllers/BillingPeriodController.php:18
* @route '/billing-periods'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingPeriodController::store
* @see app/Http/Controllers/BillingPeriodController.php:18
* @route '/billing-periods'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::store
* @see app/Http/Controllers/BillingPeriodController.php:18
* @route '/billing-periods'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::store
* @see app/Http/Controllers/BillingPeriodController.php:18
* @route '/billing-periods'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BillingPeriodController::update
* @see app/Http/Controllers/BillingPeriodController.php:24
* @route '/billing-periods/{period}'
*/
export const update = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/billing-periods/{period}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\BillingPeriodController::update
* @see app/Http/Controllers/BillingPeriodController.php:24
* @route '/billing-periods/{period}'
*/
update.url = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingPeriodController::update
* @see app/Http/Controllers/BillingPeriodController.php:24
* @route '/billing-periods/{period}'
*/
update.patch = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::update
* @see app/Http/Controllers/BillingPeriodController.php:24
* @route '/billing-periods/{period}'
*/
const updateForm = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BillingPeriodController::update
* @see app/Http/Controllers/BillingPeriodController.php:24
* @route '/billing-periods/{period}'
*/
updateForm.patch = (args: { period: number | { id: number } } | [period: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const BillingPeriodController = { index, store, update }

export default BillingPeriodController