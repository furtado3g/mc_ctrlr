import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PublicProfileController::publicProfile
* @see app/Http/Controllers/PublicProfileController.php:13
* @route '/members/{member}/public-profile'
*/
export const publicProfile = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicProfile.url(args, options),
    method: 'get',
})

publicProfile.definition = {
    methods: ["get","head"],
    url: '/members/{member}/public-profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicProfileController::publicProfile
* @see app/Http/Controllers/PublicProfileController.php:13
* @route '/members/{member}/public-profile'
*/
publicProfile.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { member: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            member: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        member: typeof args.member === 'object'
        ? args.member.id
        : args.member,
    }

    return publicProfile.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicProfileController::publicProfile
* @see app/Http/Controllers/PublicProfileController.php:13
* @route '/members/{member}/public-profile'
*/
publicProfile.get = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicProfile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicProfileController::publicProfile
* @see app/Http/Controllers/PublicProfileController.php:13
* @route '/members/{member}/public-profile'
*/
publicProfile.head = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicProfile.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicProfileController::publicProfile
* @see app/Http/Controllers/PublicProfileController.php:13
* @route '/members/{member}/public-profile'
*/
const publicProfileForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicProfile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicProfileController::publicProfile
* @see app/Http/Controllers/PublicProfileController.php:13
* @route '/members/{member}/public-profile'
*/
publicProfileForm.get = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicProfile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicProfileController::publicProfile
* @see app/Http/Controllers/PublicProfileController.php:13
* @route '/members/{member}/public-profile'
*/
publicProfileForm.head = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicProfile.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

publicProfile.form = publicProfileForm

const members = {
    publicProfile: Object.assign(publicProfile, publicProfile),
}

export default members