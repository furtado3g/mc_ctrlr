import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TableQueryController::update
* @see app/Http/Controllers/TableQueryController.php:13
* @route '/table-query'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/table-query',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TableQueryController::update
* @see app/Http/Controllers/TableQueryController.php:13
* @route '/table-query'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableQueryController::update
* @see app/Http/Controllers/TableQueryController.php:13
* @route '/table-query'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableQueryController::update
* @see app/Http/Controllers/TableQueryController.php:13
* @route '/table-query'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableQueryController::update
* @see app/Http/Controllers/TableQueryController.php:13
* @route '/table-query'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const TableQueryController = { update }

export default TableQueryController