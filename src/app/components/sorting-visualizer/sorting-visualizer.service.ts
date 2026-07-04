import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingVisualizerService {
  
  protected readonly _httpClient: HttpClient = inject(HttpClient);

  public getWikipediaSummary(searchTerm: string): Promise<Object | undefined> {
    return this._httpClient.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + searchTerm).toPromise();
  }

  public getJSON(filepath: string): Promise<Object | undefined> {
    return this._httpClient.get(filepath).toPromise();
  }
}