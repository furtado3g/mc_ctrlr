import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserProfileController::update
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/me/profile/details',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\UserProfileController::update
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserProfileController::update
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\UserProfileController::update
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserProfileController::update
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const details = {
    update: Object.assign(update, update),
}

export default details