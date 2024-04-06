export type ApiResponse  = {
    statusCode: number
    status: 'success' | 'error'
    data?: any
    message?: string
}