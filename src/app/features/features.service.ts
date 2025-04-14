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
  getDashboardStats() {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://10.0.0.18:5249';

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

  startDate: string = '2025-03-01';
  endDate: string = '2025-04-01';

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

  getRequests(
    page: number,
    pageSize: number,
    selectedStatus: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const params = {
      page: page.toString(), // Convert number to string for query params
      pageSize: pageSize.toString(),
      status: selectedStatus || '', // Ensure empty string if not provided
      startDate: startDate || '',
      endDate: endDate || '',
    };

    return this.http
      .get<any>(`${this.baseUrl}/api/CashAdvanceRequest`, {
        headers: this.getHeaders(),
        params: params, // Pass parameters
      })
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

  // getPaymentSchedule(employee: string): Observable<any> {
  //   return this.http
  //     .get(`${this.baseUrl}/api/Payments/Schedule/${employee}`, {
  //       headers: this.getHeaders(),
  //     })
  //     .pipe(catchError(this.handleError));
  // }
  updatePaymentStatus(id: number, status: number): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/api/CashAdvanceRequest/Update-Status/${id}`,
        { status },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getRequestHistory(employee: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/api/Requests/History/${employee}`, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  // Removed duplicate handleError function to resolve the error.

  getSelfNotifications(page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/api/Notification/self/Cash-advance?page=${page}&pageSize=${pageSize}`;
    return this.sendGetRequest(url);
  }

  getNotificationDetails(notificationId: string): Observable<any> {
    const url = `${this.baseUrl}/api/Notification/view/${notificationId}`;
    return this.sendGetRequest(url);
  }
  sendGetRequest(url: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.get<any>(url, options).pipe(
      map((data: any) => data),
      retry(3),
      catchError(this.handleError)
    );
  }
  uploadReceipt(paymentId: number, formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/api/CashAdvanceRequest/Upload-Receipt/${paymentId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`,
    });

    return this.http
      .put(url, formData, { headers })
      .pipe(catchError(this.handleError));
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
  getUploadedReceipt(imageFilePath: string): Observable<any> {
    const url = `${this.baseUrl}/api/File/Image/${imageFilePath}`;
    return this.http
      .get(url, {
        headers: this.getHeaders(),
        responseType: 'blob',
      })
      .pipe(
        map((blob) => URL.createObjectURL(blob)),
        catchError(this.handleError)
      );
  }
  getUserManagementStats(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/api/User/cash-advance?page=1&pageSize=10`, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  getUserDetails(page: number, pageSize: number): Observable<any> {
    return this.http
      .get<any>(
        `${this.baseUrl}/api/User/cash-advance?page=${page}&pageSize=${pageSize}`,
        { headers: this.getHeaders() }
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  // private handleError(error: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     errorMessage = `Server Error: ${error.status} - ${error.message}`;
  //   }
  //   return throwError(() => new Error(errorMessage));
  // }
  createUser(userData: any): Observable<any> {
    const url = `${this.baseUrl}/api/Auth/cash-advance/add-user`;
    return this.http
      .post<any>(url, userData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  updateUser(id: number, userData: any): Observable<any> {
    const url = `${this.baseUrl}/api/user/${id}`; // Update URL according to your API's endpoint.
    return this.http
      .put<any>(url, userData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  disableUser(userId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/user/disable/${userId}`, {}); // adjust API and method as needed
  }

  enableUser(userId: number) {
    return this.http.put(`${this.baseUrl}/api/user/enable/${userId}`, {});
  }
}
