import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {ServiceResponse} from "../lib/ServiceResponse";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
            .handle()
            .pipe(
                map((serviceResponse:ServiceResponse) => {
                    if (!serviceResponse) {
                      return ServiceResponse.createEmpty();
                    } else {
                      return serviceResponse;
                    }
                }),
            );
    }
}