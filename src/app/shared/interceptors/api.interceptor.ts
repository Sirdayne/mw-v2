import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.needToModify(req.url)) {
      return next.handle(req);
    }

    const request = req.clone({
      url: this.getModifiedUrl(req.url),
    });

    return next.handle(request);
  }

  getModifiedUrl(requestUrl): string {
    if (requestUrl && (requestUrl.includes('http://') || requestUrl.includes('https://'))) {
      return  requestUrl;
    }
    return environment.apiEndpoint + requestUrl;
  }

  needToModify(url) {
    return !url.includes(environment.apiEndpoint);
  }
}
