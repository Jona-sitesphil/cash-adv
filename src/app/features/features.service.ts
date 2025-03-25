import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private baseUrl = 'http://10.0.0.9:5249';

  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/api/Auth/Login`;
    const body = { email, password };

    return this.http.post<any>(url, body).pipe(
      map((response: any) => {
        if (response.status === 'SUCCESS' && response.data?.accessToken) {
          sessionStorage.setItem('auth_token', response.data.accessToken);
          sessionStorage.setItem('refresh_token', response.data.refreshToken);
          return response.data;
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/Auth/Logout`,
      {},
      { headers: this.getHeaders() }
    );
  }

  handleLogout(): void {
    this.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
        this.router.navigate(['/login']);
      },
      error: (error) => console.error('Logout failed:', error),
    });
  }

  // GET all requests with pagination.
  // The API is assumed to return an object with:
  // - data.cashAdvanceRequests: the current page’s items.
  // - data.totalCount: total number of records.
  // - data.totalPages: total pages.
  // - data.currentPage: the current (1-based) page.
  getRequestsPaginated(page: number, pageSize: number): Observable<any> {
    return this.http
      .get<any>(
        `${this.baseUrl}/api/CashAdvanceRequest?page=${page}&pageSize=${pageSize}`,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getSelfRequests(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/api/CashAdvanceRequest/self`, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  getRequestDetails(employee: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/api/Requests/Details/${employee}`, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  getRequestById(id: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/api/Requests/${id}`, { headers: this.getHeaders() })
      .pipe(retry(3), catchError(this.handleError));
  }

  createRequest(requestData: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/Cashadvancerequest`, requestData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateRequest(id: number, requestData: any): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/api/Requests/${id}`, requestData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteRequest(id: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/api/Requests/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  approveRequest(id: number, approvalData: any): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/api/CashAdvanceRequest/Approve/${id}`,
        approvalData,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  rejectRequest(id: number, rejectionReason: string): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/api/CashAdvanceRequest/Reject/${id}`,
        { rejectionReason },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getPaymentSchedule(employee: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/api/Payments/Schedule/${employee}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getRequestHistory(employee: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/api/Requests/History/${employee}`, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
