export type AppMessage = {
    type: 'info' | 'warning' | 'error'
    message: string
    details?: any
}

export type AppError  = {
    errorCode: number
    message: string | AppMessage[]
}

export type ApiError  = AppError & {
    statusCode: number
}