// loader.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from './loader.service';

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loaderService = inject(LoaderService);
  const apiUrl = req.url.toLowerCase(); // Normalize case

  // List of URLs that should not trigger the loader
  const excludedUrls = [
    'http://10.0.0.10:5249/api/notification/self',
    'http://10.0.0.10:5249/api/notification/view'
  ];

  // Check if request URL starts with any of the excluded URLs
  if (!excludedUrls.some(url => apiUrl.startsWith(url))) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!excludedUrls.some(url => apiUrl.startsWith(url))) {
        loaderService.hide();
      }
    })
  );
};


