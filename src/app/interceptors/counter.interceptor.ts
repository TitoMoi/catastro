import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpCounterService } from '../services/http-counter.service';

@Injectable()
export class RequestCountHttpInterceptor implements HttpInterceptor {
  constructor(private httpCounterService: HttpCounterService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.httpCounterService.pendingRequestsCount++;

    return next.handle(request).pipe(
      finalize(() => {
        this.httpCounterService.pendingRequestsCount--;
      })
    );
  }
}
