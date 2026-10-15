import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RegionalContextController::regional
* @see app/Http/Controllers/RegionalContextController.php:14
* @route '/admin/context/regional'
*/
export const regional = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regional.url(options),
    method: 'post',
})

regional.definition = {
    methods: ["post"],
    url: '/admin/context/regional',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RegionalContextController::regional
* @see app/Http/Controllers/RegionalContextController.php:14
* @route '/admin/context/regional'
*/
regional.url = (options?: RouteQueryOptions) => {
    return regional.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RegionalContextController::regional
* @see app/Http/Controllers/RegionalContextController.php:14
* @route '/admin/context/regional'
*/
regional.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regional.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RegionalContextController::regional
* @see app/Http/Controllers/RegionalContextController.php:14
* @route '/admin/context/regional'
*/
const regionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: regional.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RegionalContextController::regional
* @see app/Http/Controllers/RegionalContextController.php:14
* @route '/admin/context/regional'
*/
regionalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: regional.url(options),
    method: 'post',
})

regional.form = regionalForm

const context = {
    regional: Object.assign(regional, regional),
}

export default context