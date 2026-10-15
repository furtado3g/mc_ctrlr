import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import members from './members'
/**
* @see \App\Http\Controllers\BirthdayPostController::index
* @see app/Http/Controllers/BirthdayPostController.php:15
* @route '/birthdays'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/birthdays',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BirthdayPostController::index
* @see app/Http/Controllers/BirthdayPostController.php:15
* @route '/birthdays'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BirthdayPostController::index
* @see app/Http/Controllers/BirthdayPostController.php:15
* @route '/birthdays'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BirthdayPostController::index
* @see app/Http/Controllers/BirthdayPostController.php:15
* @route '/birthdays'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BirthdayPostController::index
* @see app/Http/Controllers/BirthdayPostController.php:15
* @route '/birthdays'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BirthdayPostController::index
* @see app/Http/Controllers/BirthdayPostController.php:15
* @route '/birthdays'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BirthdayPostController::index
* @see app/Http/Controllers/BirthdayPostController.php:15
* @route '/birthdays'
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

const birthdays = {
    index: Object.assign(index, index),
    members: Object.assign(members, members),
}

export default birthdays