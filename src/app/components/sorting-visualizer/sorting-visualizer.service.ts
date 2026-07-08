import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SortingVisualizerService {
  
  protected readonly _httpClient: HttpClient = inject(HttpClient);

  public getWikipediaSummary(lang: string, searchTerm: string): Observable<Object | undefined> {
    return this._httpClient.get(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`);
  }

  public getJSON(filepath: string): Observable<Object | undefined> {
    return this._httpClient.get(filepath);
  }
}