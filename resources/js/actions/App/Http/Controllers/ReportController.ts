import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:24
* @route '/reports/fees'
*/
export const fees = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fees.url(options),
    method: 'get',
})

fees.definition = {
    methods: ["get","head"],
    url: '/reports/fees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:24
* @route '/reports/fees'
*/
fees.url = (options?: RouteQueryOptions) => {
    return fees.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:24
* @route '/reports/fees'
*/
fees.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fees.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:24
* @route '/reports/fees'
*/
fees.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fees.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:24
* @route '/reports/fees'
*/
const feesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fees.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:24
* @route '/reports/fees'
*/
feesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fees.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:24
* @route '/reports/fees'
*/
feesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fees.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fees.form = feesForm

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:34
* @route '/reports/cash'
*/
export const cash = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cash.url(options),
    method: 'get',
})

cash.definition = {
    methods: ["get","head"],
    url: '/reports/cash',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:34
* @route '/reports/cash'
*/
cash.url = (options?: RouteQueryOptions) => {
    return cash.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:34
* @route '/reports/cash'
*/
cash.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cash.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:34
* @route '/reports/cash'
*/
cash.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cash.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:34
* @route '/reports/cash'
*/
const cashForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cash.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:34
* @route '/reports/cash'
*/
cashForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cash.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:34
* @route '/reports/cash'
*/
cashForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cash.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

cash.form = cashForm

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:43
* @route '/reports/fiscal'
*/
export const fiscal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fiscal.url(options),
    method: 'get',
})

fiscal.definition = {
    methods: ["get","head"],
    url: '/reports/fiscal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:43
* @route '/reports/fiscal'
*/
fiscal.url = (options?: RouteQueryOptions) => {
    return fiscal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:43
* @route '/reports/fiscal'
*/
fiscal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fiscal.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:43
* @route '/reports/fiscal'
*/
fiscal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fiscal.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:43
* @route '/reports/fiscal'
*/
const fiscalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscal.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:43
* @route '/reports/fiscal'
*/
fiscalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscal.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:43
* @route '/reports/fiscal'
*/
fiscalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscal.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fiscal.form = fiscalForm

const ReportController = { fees, cash, fiscal }

export default ReportController