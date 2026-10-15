import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MemberProfileController::edit
* @see app/Http/Controllers/MemberProfileController.php:16
* @route '/me/profile'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/me/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MemberProfileController::edit
* @see app/Http/Controllers/MemberProfileController.php:16
* @route '/me/profile'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileController::edit
* @see app/Http/Controllers/MemberProfileController.php:16
* @route '/me/profile'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MemberProfileController::edit
* @see app/Http/Controllers/MemberProfileController.php:16
* @route '/me/profile'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MemberProfileController::edit
* @see app/Http/Controllers/MemberProfileController.php:16
* @route '/me/profile'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MemberProfileController::edit
* @see app/Http/Controllers/MemberProfileController.php:16
* @route '/me/profile'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MemberProfileController::edit
* @see app/Http/Controllers/MemberProfileController.php:16
* @route '/me/profile'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\MemberProfileController::update
* @see app/Http/Controllers/MemberProfileController.php:27
* @route '/me/profile'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/me/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemberProfileController::update
* @see app/Http/Controllers/MemberProfileController.php:27
* @route '/me/profile'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileController::update
* @see app/Http/Controllers/MemberProfileController.php:27
* @route '/me/profile'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MemberProfileController::update
* @see app/Http/Controllers/MemberProfileController.php:27
* @route '/me/profile'
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
* @see \App\Http\Controllers\MemberProfileController::update
* @see app/Http/Controllers/MemberProfileController.php:27
* @route '/me/profile'
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

/**
* @see \App\Http\Controllers\MemberProfileController::updateMembershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
export const updateMembershipDate = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMembershipDate.url(options),
    method: 'patch',
})

updateMembershipDate.definition = {
    methods: ["patch"],
    url: '/me/profile/membership-date',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemberProfileController::updateMembershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
updateMembershipDate.url = (options?: RouteQueryOptions) => {
    return updateMembershipDate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileController::updateMembershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
updateMembershipDate.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMembershipDate.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MemberProfileController::updateMembershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
const updateMembershipDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMembershipDate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberProfileController::updateMembershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
updateMembershipDateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMembershipDate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMembershipDate.form = updateMembershipDateForm

const MemberProfileController = { edit, update, updateMembershipDate }

export default MemberProfileController