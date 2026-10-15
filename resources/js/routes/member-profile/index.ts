import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import motorcycles from './motorcycles'
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
* @see \App\Http\Controllers\MemberProfileContactsController::contacts
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
export const contacts = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: contacts.url(options),
    method: 'patch',
})

contacts.definition = {
    methods: ["patch"],
    url: '/me/profile/contacts',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemberProfileContactsController::contacts
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
contacts.url = (options?: RouteQueryOptions) => {
    return contacts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileContactsController::contacts
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
contacts.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: contacts.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MemberProfileContactsController::contacts
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
const contactsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: contacts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberProfileContactsController::contacts
* @see app/Http/Controllers/MemberProfileContactsController.php:11
* @route '/me/profile/contacts'
*/
contactsForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: contacts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

contacts.form = contactsForm

/**
* @see \App\Http\Controllers\MemberProfileController::membershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
export const membershipDate = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: membershipDate.url(options),
    method: 'patch',
})

membershipDate.definition = {
    methods: ["patch"],
    url: '/me/profile/membership-date',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemberProfileController::membershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
membershipDate.url = (options?: RouteQueryOptions) => {
    return membershipDate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberProfileController::membershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
membershipDate.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: membershipDate.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MemberProfileController::membershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
const membershipDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: membershipDate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MemberProfileController::membershipDate
* @see app/Http/Controllers/MemberProfileController.php:36
* @route '/me/profile/membership-date'
*/
membershipDateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: membershipDate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

membershipDate.form = membershipDateForm

const memberProfile = {
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    contacts: Object.assign(contacts, contacts),
    motorcycles: Object.assign(motorcycles, motorcycles),
    membershipDate: Object.assign(membershipDate, membershipDate),
}

export default memberProfile