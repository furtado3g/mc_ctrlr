import context from './context'
import regionals from './regionals'

const admin = {
    context: Object.assign(context, context),
    regionals: Object.assign(regionals, regionals),
}

export default admin