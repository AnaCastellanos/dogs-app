import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogService, DogImage } from './dog.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private dogService = inject(DogService);

  mainDog = signal<DogImage | null>(null);
  thumbnails = signal<DogImage[]>([]);
  favorites = signal<DogImage[]>([]);
  loading = signal(true);
  thumbnailsLoading = signal(true);

  ngOnInit(): void {
    this.loadMainDog();
    this.loadThumbnails();
  }

  loadMainDog(): void {
    this.loading.set(true);
    this.dogService.getRandomDog().subscribe({
      next: (dog) => {
        this.mainDog.set(dog);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadThumbnails(): void {
    this.thumbnailsLoading.set(true);
    this.dogService.getRandomDogs(10).subscribe({
      next: (dogs) => {
        this.thumbnails.set(dogs);
        this.thumbnailsLoading.set(false);
      },
      error: () => this.thumbnailsLoading.set(false),
    });
  }

  selectThumbnail(dog: DogImage): void {
    this.mainDog.set(dog);
  }

  addToFavorites(): void {
    const current = this.mainDog();
    if (!current) return;
    const alreadyFavorited = this.favorites().some((f) => f.url === current.url);
    if (!alreadyFavorited) {
      this.favorites.update((favs) => [...favs, current]);
    }
  }

  selectFavorite(dog: DogImage): void {
    this.mainDog.set(dog);
  }

  removeFromFavorites(dog: DogImage): void {
    this.favorites.update((favs) => favs.filter((f) => f.url !== dog.url));
  }

  isCurrentFavorited(): boolean {
    const current = this.mainDog();
    if (!current) return false;
    return this.favorites().some((f) => f.url === current.url);
  }

  refresh(): void {
    this.loadMainDog();
    this.loadThumbnails();
  }
}
