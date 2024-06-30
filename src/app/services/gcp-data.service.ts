import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GcpDataService {

  keyword:string = '';
  private apiUrlGcpData = 'http://35.244.4.78:3000/api/gcp-data';
  private apiUrlVideoData = 'http://35.244.4.78:3000/api/video-data';


  constructor(private http: HttpClient) { }

  getGcpData(keyword: string): Observable<any> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<any>(this.apiUrlGcpData, { params });
  }

  getVideoData(id: string): Observable<any> {
    this.keyword = sessionStorage.getItem('keyword') || '{}';
    const params = new HttpParams().set('id', id).set('keyword', this.keyword);
    return this.http.get<any>(this.apiUrlVideoData, { params });
  }
}
