import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::index
* @see app/Http/Controllers/InstitutionalPageAdminController.php:19
* @route '/institutional-page'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/institutional-page',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::index
* @see app/Http/Controllers/InstitutionalPageAdminController.php:19
* @route '/institutional-page'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::index
* @see app/Http/Controllers/InstitutionalPageAdminController.php:19
* @route '/institutional-page'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::index
* @see app/Http/Controllers/InstitutionalPageAdminController.php:19
* @route '/institutional-page'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::index
* @see app/Http/Controllers/InstitutionalPageAdminController.php:19
* @route '/institutional-page'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::index
* @see app/Http/Controllers/InstitutionalPageAdminController.php:19
* @route '/institutional-page'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::index
* @see app/Http/Controllers/InstitutionalPageAdminController.php:19
* @route '/institutional-page'
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
* @see \App\Http\Controllers\InstitutionalPageAdminController::save
* @see app/Http/Controllers/InstitutionalPageAdminController.php:46
* @route '/institutional-page/draft'
*/
export const save = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: save.url(options),
    method: 'patch',
})

save.definition = {
    methods: ["patch"],
    url: '/institutional-page/draft',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::save
* @see app/Http/Controllers/InstitutionalPageAdminController.php:46
* @route '/institutional-page/draft'
*/
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::save
* @see app/Http/Controllers/InstitutionalPageAdminController.php:46
* @route '/institutional-page/draft'
*/
save.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: save.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::save
* @see app/Http/Controllers/InstitutionalPageAdminController.php:46
* @route '/institutional-page/draft'
*/
const saveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: save.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::save
* @see app/Http/Controllers/InstitutionalPageAdminController.php:46
* @route '/institutional-page/draft'
*/
saveForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: save.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

save.form = saveForm

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::publish
* @see app/Http/Controllers/InstitutionalPageAdminController.php:53
* @route '/institutional-page/publish'
*/
export const publish = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/institutional-page/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::publish
* @see app/Http/Controllers/InstitutionalPageAdminController.php:53
* @route '/institutional-page/publish'
*/
publish.url = (options?: RouteQueryOptions) => {
    return publish.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::publish
* @see app/Http/Controllers/InstitutionalPageAdminController.php:53
* @route '/institutional-page/publish'
*/
publish.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::publish
* @see app/Http/Controllers/InstitutionalPageAdminController.php:53
* @route '/institutional-page/publish'
*/
const publishForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InstitutionalPageAdminController::publish
* @see app/Http/Controllers/InstitutionalPageAdminController.php:53
* @route '/institutional-page/publish'
*/
publishForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(options),
    method: 'post',
})

publish.form = publishForm

const InstitutionalPageAdminController = { index, save, publish }

export default InstitutionalPageAdminController