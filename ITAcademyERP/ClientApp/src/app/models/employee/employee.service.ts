import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'api/employees';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]>{
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployee(id: string): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Employee>(url);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.apiUrl + "/" + employee.id, employee, this.httpOptions);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee, this.httpOptions);
  }

  deleteEmployee(employee: Employee | string): Observable<Employee> {
    const id = typeof employee === 'string' ? employee : employee.id;
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<Employee>(url, this.httpOptions);
  }
}
