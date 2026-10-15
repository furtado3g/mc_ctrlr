import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserProfileController::uploadAvatar
* @see app/Http/Controllers/UserProfileController.php:14
* @route '/me/profile/avatar'
*/
export const uploadAvatar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

uploadAvatar.definition = {
    methods: ["post"],
    url: '/me/profile/avatar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserProfileController::uploadAvatar
* @see app/Http/Controllers/UserProfileController.php:14
* @route '/me/profile/avatar'
*/
uploadAvatar.url = (options?: RouteQueryOptions) => {
    return uploadAvatar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserProfileController::uploadAvatar
* @see app/Http/Controllers/UserProfileController.php:14
* @route '/me/profile/avatar'
*/
uploadAvatar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserProfileController::uploadAvatar
* @see app/Http/Controllers/UserProfileController.php:14
* @route '/me/profile/avatar'
*/
const uploadAvatarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadAvatar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserProfileController::uploadAvatar
* @see app/Http/Controllers/UserProfileController.php:14
* @route '/me/profile/avatar'
*/
uploadAvatarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadAvatar.url(options),
    method: 'post',
})

uploadAvatar.form = uploadAvatarForm

/**
* @see \App\Http\Controllers\UserProfileController::removeAvatar
* @see app/Http/Controllers/UserProfileController.php:31
* @route '/me/profile/avatar'
*/
export const removeAvatar = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeAvatar.url(options),
    method: 'delete',
})

removeAvatar.definition = {
    methods: ["delete"],
    url: '/me/profile/avatar',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserProfileController::removeAvatar
* @see app/Http/Controllers/UserProfileController.php:31
* @route '/me/profile/avatar'
*/
removeAvatar.url = (options?: RouteQueryOptions) => {
    return removeAvatar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserProfileController::removeAvatar
* @see app/Http/Controllers/UserProfileController.php:31
* @route '/me/profile/avatar'
*/
removeAvatar.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeAvatar.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserProfileController::removeAvatar
* @see app/Http/Controllers/UserProfileController.php:31
* @route '/me/profile/avatar'
*/
const removeAvatarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeAvatar.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserProfileController::removeAvatar
* @see app/Http/Controllers/UserProfileController.php:31
* @route '/me/profile/avatar'
*/
removeAvatarForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeAvatar.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeAvatar.form = removeAvatarForm

/**
* @see \App\Http\Controllers\UserProfileController::updateDetails
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
export const updateDetails = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateDetails.url(options),
    method: 'patch',
})

updateDetails.definition = {
    methods: ["patch"],
    url: '/me/profile/details',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\UserProfileController::updateDetails
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
updateDetails.url = (options?: RouteQueryOptions) => {
    return updateDetails.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserProfileController::updateDetails
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
updateDetails.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateDetails.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\UserProfileController::updateDetails
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
const updateDetailsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateDetails.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserProfileController::updateDetails
* @see app/Http/Controllers/UserProfileController.php:48
* @route '/me/profile/details'
*/
updateDetailsForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateDetails.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateDetails.form = updateDetailsForm

const UserProfileController = { uploadAvatar, removeAvatar, updateDetails }

export default UserProfileController