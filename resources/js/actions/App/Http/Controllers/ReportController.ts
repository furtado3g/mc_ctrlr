import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:72
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
* @see app/Http/Controllers/ReportController.php:72
* @route '/reports/fees'
*/
fees.url = (options?: RouteQueryOptions) => {
    return fees.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:72
* @route '/reports/fees'
*/
fees.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fees.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:72
* @route '/reports/fees'
*/
fees.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fees.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:72
* @route '/reports/fees'
*/
const feesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fees.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:72
* @route '/reports/fees'
*/
feesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fees.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fees
* @see app/Http/Controllers/ReportController.php:72
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
* @see \App\Http\Controllers\ReportController::feesCsv
* @see app/Http/Controllers/ReportController.php:117
* @route '/reports/fees/export'
*/
export const feesCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feesCsv.url(options),
    method: 'get',
})

feesCsv.definition = {
    methods: ["get","head"],
    url: '/reports/fees/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::feesCsv
* @see app/Http/Controllers/ReportController.php:117
* @route '/reports/fees/export'
*/
feesCsv.url = (options?: RouteQueryOptions) => {
    return feesCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::feesCsv
* @see app/Http/Controllers/ReportController.php:117
* @route '/reports/fees/export'
*/
feesCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feesCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::feesCsv
* @see app/Http/Controllers/ReportController.php:117
* @route '/reports/fees/export'
*/
feesCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feesCsv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::feesCsv
* @see app/Http/Controllers/ReportController.php:117
* @route '/reports/fees/export'
*/
const feesCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feesCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::feesCsv
* @see app/Http/Controllers/ReportController.php:117
* @route '/reports/fees/export'
*/
feesCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feesCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::feesCsv
* @see app/Http/Controllers/ReportController.php:117
* @route '/reports/fees/export'
*/
feesCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feesCsv.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

feesCsv.form = feesCsvForm

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:87
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
* @see app/Http/Controllers/ReportController.php:87
* @route '/reports/cash'
*/
cash.url = (options?: RouteQueryOptions) => {
    return cash.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:87
* @route '/reports/cash'
*/
cash.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cash.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:87
* @route '/reports/cash'
*/
cash.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cash.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:87
* @route '/reports/cash'
*/
const cashForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cash.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:87
* @route '/reports/cash'
*/
cashForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cash.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cash
* @see app/Http/Controllers/ReportController.php:87
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
* @see \App\Http\Controllers\ReportController::cashCsv
* @see app/Http/Controllers/ReportController.php:128
* @route '/reports/cash/export'
*/
export const cashCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cashCsv.url(options),
    method: 'get',
})

cashCsv.definition = {
    methods: ["get","head"],
    url: '/reports/cash/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::cashCsv
* @see app/Http/Controllers/ReportController.php:128
* @route '/reports/cash/export'
*/
cashCsv.url = (options?: RouteQueryOptions) => {
    return cashCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::cashCsv
* @see app/Http/Controllers/ReportController.php:128
* @route '/reports/cash/export'
*/
cashCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cashCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cashCsv
* @see app/Http/Controllers/ReportController.php:128
* @route '/reports/cash/export'
*/
cashCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cashCsv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::cashCsv
* @see app/Http/Controllers/ReportController.php:128
* @route '/reports/cash/export'
*/
const cashCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cashCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cashCsv
* @see app/Http/Controllers/ReportController.php:128
* @route '/reports/cash/export'
*/
cashCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cashCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::cashCsv
* @see app/Http/Controllers/ReportController.php:128
* @route '/reports/cash/export'
*/
cashCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cashCsv.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

cashCsv.form = cashCsvForm

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:102
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
* @see app/Http/Controllers/ReportController.php:102
* @route '/reports/fiscal'
*/
fiscal.url = (options?: RouteQueryOptions) => {
    return fiscal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:102
* @route '/reports/fiscal'
*/
fiscal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fiscal.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:102
* @route '/reports/fiscal'
*/
fiscal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fiscal.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:102
* @route '/reports/fiscal'
*/
const fiscalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscal.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:102
* @route '/reports/fiscal'
*/
fiscalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscal.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscal
* @see app/Http/Controllers/ReportController.php:102
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

/**
* @see \App\Http\Controllers\ReportController::fiscalCsv
* @see app/Http/Controllers/ReportController.php:138
* @route '/reports/fiscal/export'
*/
export const fiscalCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fiscalCsv.url(options),
    method: 'get',
})

fiscalCsv.definition = {
    methods: ["get","head"],
    url: '/reports/fiscal/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::fiscalCsv
* @see app/Http/Controllers/ReportController.php:138
* @route '/reports/fiscal/export'
*/
fiscalCsv.url = (options?: RouteQueryOptions) => {
    return fiscalCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::fiscalCsv
* @see app/Http/Controllers/ReportController.php:138
* @route '/reports/fiscal/export'
*/
fiscalCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fiscalCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscalCsv
* @see app/Http/Controllers/ReportController.php:138
* @route '/reports/fiscal/export'
*/
fiscalCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fiscalCsv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::fiscalCsv
* @see app/Http/Controllers/ReportController.php:138
* @route '/reports/fiscal/export'
*/
const fiscalCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscalCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscalCsv
* @see app/Http/Controllers/ReportController.php:138
* @route '/reports/fiscal/export'
*/
fiscalCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscalCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::fiscalCsv
* @see app/Http/Controllers/ReportController.php:138
* @route '/reports/fiscal/export'
*/
fiscalCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fiscalCsv.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fiscalCsv.form = fiscalCsvForm

const ReportController = { fees, feesCsv, cash, cashCsv, fiscal, fiscalCsv }

export default ReportController