export class ServiceResponse {
    public statusCode: number;
    private data?: any;
    public nextToken?: string;
    public message?: string;

    static createSuccess(data: any, nextToken?: string): ServiceResponse {
        const response = new ServiceResponse();
        response.statusCode = 200;
        response.data = data;
        response.nextToken = nextToken;
        return response;
    }

    static createFailed(err: any): ServiceResponse {
        const response = new ServiceResponse();
        response.statusCode = 500;
        response.message = err;
        return response;
    }

    static createEmpty(): ServiceResponse {
        const response = new ServiceResponse();
        response.statusCode = 200;
        return response;
    }

    hasData() {
        return !!this.data;
    }
}