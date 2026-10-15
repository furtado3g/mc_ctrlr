import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MemberProfileContactsController::update
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/me/profile/contacts',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemberProfileContactsController::update
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileContactsController::update
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MemberProfileContactsController::update
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
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
* @see \App\Http\Controllers\MemberProfileContactsController::update
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
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

const MemberProfileContactsController = { update }

export default MemberProfileContactsController