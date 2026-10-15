import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InstitutionalLandingController::__invoke
* @see app/Http/Controllers/InstitutionalLandingController.php:13
* @route '/'
*/
const InstitutionalLandingController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: InstitutionalLandingController.url(options),
    method: 'get',
})

InstitutionalLandingController.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InstitutionalLandingController::__invoke
* @see app/Http/Controllers/InstitutionalLandingController.php:13
* @route '/'
*/
InstitutionalLandingController.url = (options?: RouteQueryOptions) => {
    return InstitutionalLandingController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InstitutionalLandingController::__invoke
* @see app/Http/Controllers/InstitutionalLandingController.php:13
* @route '/'
*/
InstitutionalLandingController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: InstitutionalLandingController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InstitutionalLandingController::__invoke
* @see app/Http/Controllers/InstitutionalLandingController.php:13
* @route '/'
*/
InstitutionalLandingController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: InstitutionalLandingController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InstitutionalLandingController::__invoke
* @see app/Http/Controllers/InstitutionalLandingController.php:13
* @route '/'
*/
const InstitutionalLandingControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: InstitutionalLandingController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InstitutionalLandingController::__invoke
* @see app/Http/Controllers/InstitutionalLandingController.php:13
* @route '/'
*/
InstitutionalLandingControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: InstitutionalLandingController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InstitutionalLandingController::__invoke
* @see app/Http/Controllers/InstitutionalLandingController.php:13
* @route '/'
*/
InstitutionalLandingControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: InstitutionalLandingController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

InstitutionalLandingController.form = InstitutionalLandingControllerForm

export default InstitutionalLandingController