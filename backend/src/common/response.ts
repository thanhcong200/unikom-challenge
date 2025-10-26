export class BaseResponse {
    data: Array<any>;
    meta: {
        totalItems: number,
        totalPages: number,
        currentPage: number,
        hasNextPage: boolean,
        hasPrevPage: boolean,
        page: number,
        limit: number,
    }
}