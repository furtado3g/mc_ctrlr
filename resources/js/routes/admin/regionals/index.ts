import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RegionalController::index
* @see app/Http/Controllers/RegionalController.php:19
* @route '/admin/regionals'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/regionals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RegionalController::index
* @see app/Http/Controllers/RegionalController.php:19
* @route '/admin/regionals'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RegionalController::index
* @see app/Http/Controllers/RegionalController.php:19
* @route '/admin/regionals'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RegionalController::index
* @see app/Http/Controllers/RegionalController.php:19
* @route '/admin/regionals'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RegionalController::index
* @see app/Http/Controllers/RegionalController.php:19
* @route '/admin/regionals'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RegionalController::index
* @see app/Http/Controllers/RegionalController.php:19
* @route '/admin/regionals'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RegionalController::index
* @see app/Http/Controllers/RegionalController.php:19
* @route '/admin/regionals'
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

/**
* @see \App\Http\Controllers\RegionalController::store
* @see app/Http/Controllers/RegionalController.php:66
* @route '/admin/regionals'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/regionals',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RegionalController::store
* @see app/Http/Controllers/RegionalController.php:66
* @route '/admin/regionals'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RegionalController::store
* @see app/Http/Controllers/RegionalController.php:66
* @route '/admin/regionals'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RegionalController::store
* @see app/Http/Controllers/RegionalController.php:66
* @route '/admin/regionals'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RegionalController::store
* @see app/Http/Controllers/RegionalController.php:66
* @route '/admin/regionals'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\RegionalController::update
* @see app/Http/Controllers/RegionalController.php:117
* @route '/admin/regionals/{regional}'
*/
export const update = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/regionals/{regional}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RegionalController::update
* @see app/Http/Controllers/RegionalController.php:117
* @route '/admin/regionals/{regional}'
*/
update.url = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { regional: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { regional: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            regional: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        regional: typeof args.regional === 'object'
        ? args.regional.id
        : args.regional,
    }

    return update.definition.url
            .replace('{regional}', parsedArgs.regional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RegionalController::update
* @see app/Http/Controllers/RegionalController.php:117
* @route '/admin/regionals/{regional}'
*/
update.patch = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RegionalController::update
* @see app/Http/Controllers/RegionalController.php:117
* @route '/admin/regionals/{regional}'
*/
const updateForm = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RegionalController::update
* @see app/Http/Controllers/RegionalController.php:117
* @route '/admin/regionals/{regional}'
*/
updateForm.patch = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\RegionalController::toggleStatus
* @see app/Http/Controllers/RegionalController.php:199
* @route '/admin/regionals/{regional}/toggle-status'
*/
export const toggleStatus = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/regionals/{regional}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RegionalController::toggleStatus
* @see app/Http/Controllers/RegionalController.php:199
* @route '/admin/regionals/{regional}/toggle-status'
*/
toggleStatus.url = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { regional: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { regional: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            regional: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        regional: typeof args.regional === 'object'
        ? args.regional.id
        : args.regional,
    }

    return toggleStatus.definition.url
            .replace('{regional}', parsedArgs.regional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RegionalController::toggleStatus
* @see app/Http/Controllers/RegionalController.php:199
* @route '/admin/regionals/{regional}/toggle-status'
*/
toggleStatus.post = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RegionalController::toggleStatus
* @see app/Http/Controllers/RegionalController.php:199
* @route '/admin/regionals/{regional}/toggle-status'
*/
const toggleStatusForm = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RegionalController::toggleStatus
* @see app/Http/Controllers/RegionalController.php:199
* @route '/admin/regionals/{regional}/toggle-status'
*/
toggleStatusForm.post = (args: { regional: number | { id: number } } | [regional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.form = toggleStatusForm

const regionals = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    toggleStatus: Object.assign(toggleStatus, toggleStatus),
}

export default regionals