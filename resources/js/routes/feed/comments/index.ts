import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FeedInteractionController::destroy
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
export const destroy = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/feed/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FeedInteractionController::destroy
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
destroy.url = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return destroy.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeedInteractionController::destroy
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
destroy.delete = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::destroy
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
const destroyForm = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::destroy
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
destroyForm.delete = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const comments = {
    destroy: Object.assign(destroy, destroy),
}

export default comments