import HttpStatusCode from "../../constants/httpStatusCode"

export type ActionMessages = {
    type: 'info' | 'warning' | 'error'
    messages: string
    details: any
}

export type ActionResult = {
    status: 'success' | 'error'
    data?: any
    message?: string | ActionMessages[]
}

export type ActionResponse = {
    statusCode: HttpStatusCode
} & ActionResult