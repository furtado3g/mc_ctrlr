import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FeedInteractionController::toggleLike
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
export const toggleLike = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleLike.url(args, options),
    method: 'post',
})

toggleLike.definition = {
    methods: ["post"],
    url: '/feed/posts/{post}/likes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FeedInteractionController::toggleLike
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
toggleLike.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return toggleLike.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeedInteractionController::toggleLike
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
toggleLike.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleLike.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::toggleLike
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
const toggleLikeForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleLike.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::toggleLike
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
toggleLikeForm.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleLike.url(args, options),
    method: 'post',
})

toggleLike.form = toggleLikeForm

/**
* @see \App\Http\Controllers\FeedInteractionController::storeComment
* @see app/Http/Controllers/FeedInteractionController.php:37
* @route '/feed/posts/{post}/comments'
*/
export const storeComment = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})

storeComment.definition = {
    methods: ["post"],
    url: '/feed/posts/{post}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FeedInteractionController::storeComment
* @see app/Http/Controllers/FeedInteractionController.php:37
* @route '/feed/posts/{post}/comments'
*/
storeComment.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return storeComment.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeedInteractionController::storeComment
* @see app/Http/Controllers/FeedInteractionController.php:37
* @route '/feed/posts/{post}/comments'
*/
storeComment.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::storeComment
* @see app/Http/Controllers/FeedInteractionController.php:37
* @route '/feed/posts/{post}/comments'
*/
const storeCommentForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::storeComment
* @see app/Http/Controllers/FeedInteractionController.php:37
* @route '/feed/posts/{post}/comments'
*/
storeCommentForm.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeComment.url(args, options),
    method: 'post',
})

storeComment.form = storeCommentForm

/**
* @see \App\Http\Controllers\FeedInteractionController::destroyComment
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
export const destroyComment = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyComment.url(args, options),
    method: 'delete',
})

destroyComment.definition = {
    methods: ["delete"],
    url: '/feed/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FeedInteractionController::destroyComment
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
destroyComment.url = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyComment.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeedInteractionController::destroyComment
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
destroyComment.delete = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyComment.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::destroyComment
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
const destroyCommentForm = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyComment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::destroyComment
* @see app/Http/Controllers/FeedInteractionController.php:49
* @route '/feed/comments/{comment}'
*/
destroyCommentForm.delete = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyComment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyComment.form = destroyCommentForm

const FeedInteractionController = { toggleLike, storeComment, destroyComment }

export default FeedInteractionController