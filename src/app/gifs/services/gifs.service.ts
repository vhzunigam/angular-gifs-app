import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { Gifs, SearchResponse } from "../interfaces/gifs.interfaces";

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gifs[] = [];

  private _tagsHistory: string[] = [];
  private apikey: string = '1hb8j79HgHG4linSDJtSHINXCmBJ7NYs';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [... this._tagsHistory];
  }

  searchTag(tag: string): void {

    if (tag == '') return;

    this.organizedHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe(response => {
        this.gifList = response.data;
        // console.log(this.gifList);
      });
  }

  private organizedHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this._tagsHistory.splice(0, 10);

    // Llenado del localstorage
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {

    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    this.searchTag(this._tagsHistory[0]);
  }

}
