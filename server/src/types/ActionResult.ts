import HttpStatusCode from "../../constants/httpStatusCode"

export type ServiceMessage = {
    type: 'info' | 'warning' | 'error'
    message: string
    details: any
}

export type ServiceResult = {
    status: 'success' | 'error'
    data?: any
    message?: string | ServiceMessage[]
}

export type HttpResponseData = {
    statusCode: HttpStatusCode
} & ServiceResult