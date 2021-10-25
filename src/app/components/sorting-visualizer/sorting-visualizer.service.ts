import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingVisualizerService {
  
  constructor(private _httpClient: HttpClient) {}

  getWikipediaSummary(searchTerm: string) {
    return this._httpClient.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + searchTerm).toPromise();
  }
}