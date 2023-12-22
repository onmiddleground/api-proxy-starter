export class HttpResponse {
    constructor(public readonly status: number, public readonly data: any, public readonly nextToken: string) {
    }
}