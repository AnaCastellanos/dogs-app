import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface DogImage {
  url: string;
  breed: string;
}

@Injectable({ providedIn: 'root' })
export class DogService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'https://dog.ceo/api';

  getRandomDog(): Observable<DogImage> {
    return this.http
      .get<{ message: string; status: string }>(
        `${this.BASE_URL}/breeds/image/random`
      )
      .pipe(map((res) => ({ url: res.message, breed: this.extractBreed(res.message) })));
  }

  getRandomDogs(count: number): Observable<DogImage[]> {
    return this.http
      .get<{ message: string[]; status: string }>(
        `${this.BASE_URL}/breeds/image/random/${count}`
      )
      .pipe(
        map((res) => res.message.map((url) => ({ url, breed: this.extractBreed(url) })))
      );
  }

  extractBreed(url: string): string {
    const match = url.match(/\/breeds\/([^/]+)\//);
    if (!match) return 'Unknown';
    const breedSlug = match[1];
    const parts = breedSlug.split('-');
    return parts
      .reverse()
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }
}
