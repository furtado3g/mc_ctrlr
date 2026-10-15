import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import comments from './comments'
/**
* @see \App\Http\Controllers\FeedController::store
* @see app/Http/Controllers/FeedController.php:110
* @route '/feed/posts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/feed/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FeedController::store
* @see app/Http/Controllers/FeedController.php:110
* @route '/feed/posts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeedController::store
* @see app/Http/Controllers/FeedController.php:110
* @route '/feed/posts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedController::store
* @see app/Http/Controllers/FeedController.php:110
* @route '/feed/posts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedController::store
* @see app/Http/Controllers/FeedController.php:110
* @route '/feed/posts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FeedController::destroy
* @see app/Http/Controllers/FeedController.php:141
* @route '/feed/posts/{post}'
*/
export const destroy = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/feed/posts/{post}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FeedController::destroy
* @see app/Http/Controllers/FeedController.php:141
* @route '/feed/posts/{post}'
*/
destroy.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeedController::destroy
* @see app/Http/Controllers/FeedController.php:141
* @route '/feed/posts/{post}'
*/
destroy.delete = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FeedController::destroy
* @see app/Http/Controllers/FeedController.php:141
* @route '/feed/posts/{post}'
*/
const destroyForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedController::destroy
* @see app/Http/Controllers/FeedController.php:141
* @route '/feed/posts/{post}'
*/
destroyForm.delete = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\FeedInteractionController::likes
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
export const likes = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: likes.url(args, options),
    method: 'post',
})

likes.definition = {
    methods: ["post"],
    url: '/feed/posts/{post}/likes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FeedInteractionController::likes
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
likes.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return likes.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FeedInteractionController::likes
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
likes.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: likes.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::likes
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
const likesForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: likes.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FeedInteractionController::likes
* @see app/Http/Controllers/FeedInteractionController.php:16
* @route '/feed/posts/{post}/likes'
*/
likesForm.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: likes.url(args, options),
    method: 'post',
})

likes.form = likesForm

const posts = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
    likes: Object.assign(likes, likes),
    comments: Object.assign(comments, comments),
}

export default posts