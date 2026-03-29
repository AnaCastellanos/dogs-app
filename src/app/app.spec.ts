import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { App } from './app';
import { DogService, DogImage } from './dog.service';

const mockDog: DogImage = {
  url: 'https://images.dog.ceo/breeds/labrador/n02099712_1.jpg',
  breed: 'Labrador',
};

const mockThumbnails: DogImage[] = Array.from({ length: 10 }, (_, i) => ({
  url: `https://images.dog.ceo/breeds/poodle/test${i}.jpg`,
  breed: `Poodle ${i}`,
}));

describe('App', () => {
  let mockDogService: {
    getRandomDog: ReturnType<typeof vi.fn>;
    getRandomDogs: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockDogService = {
      getRandomDog: vi.fn(() => of(mockDog)),
      getRandomDogs: vi.fn(() => of(mockThumbnails)),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: DogService, useValue: mockDogService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Dogs App heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(h1.textContent).toContain('Dogs App');
  });

  it('should call getRandomDog and getRandomDogs on init', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(mockDogService.getRandomDog).toHaveBeenCalledOnce();
    expect(mockDogService.getRandomDogs).toHaveBeenCalledWith(10);
  });

  it('should populate mainDog and thumbnails after loading', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    await fixture.whenStable();
    expect(app.mainDog()).toEqual(mockDog);
    expect(app.thumbnails()).toEqual(mockThumbnails);
    expect(app.loading()).toBe(false);
    expect(app.thumbnailsLoading()).toBe(false);
  });

  it('should set loading to false even when the API errors', async () => {
    mockDogService.getRandomDog.mockReturnValue(throwError(() => new Error('API Error')));
    mockDogService.getRandomDogs.mockReturnValue(throwError(() => new Error('API Error')));
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    await fixture.whenStable();
    expect(app.loading()).toBe(false);
    expect(app.thumbnailsLoading()).toBe(false);
  });

  describe('addToFavorites', () => {
    it('should add the current dog to favorites', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      app.addToFavorites();
      expect(app.favorites()).toHaveLength(1);
      expect(app.favorites()[0]).toEqual(mockDog);
    });

    it('should not add a duplicate dog to favorites', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      app.addToFavorites();
      app.addToFavorites();
      expect(app.favorites()).toHaveLength(1);
    });

    it('should do nothing when mainDog is null', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      app.addToFavorites();
      expect(app.favorites()).toHaveLength(0);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a specific dog from favorites', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      app.addToFavorites();
      expect(app.favorites()).toHaveLength(1);
      app.removeFromFavorites(mockDog);
      expect(app.favorites()).toHaveLength(0);
    });
  });

  describe('selectThumbnail', () => {
    it('should set the clicked thumbnail as the main dog', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      const thumbnail = mockThumbnails[3];
      app.selectThumbnail(thumbnail);
      expect(app.mainDog()).toEqual(thumbnail);
    });
  });

  describe('selectFavorite', () => {
    it('should set the clicked favorite as the main dog', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      const other: DogImage = { url: 'https://example.com/other.jpg', breed: 'Poodle' };
      app.selectFavorite(other);
      expect(app.mainDog()).toEqual(other);
    });
  });

  describe('isCurrentFavorited', () => {
    it('should return false when the main dog has not been favorited', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      expect(app.isCurrentFavorited()).toBe(false);
    });

    it('should return true after adding the main dog to favorites', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      app.addToFavorites();
      expect(app.isCurrentFavorited()).toBe(true);
    });

    it('should return false when mainDog is null', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.isCurrentFavorited()).toBe(false);
    });
  });

  describe('refresh', () => {
    it('should reload the main dog and thumbnails', async () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      await fixture.whenStable();
      app.refresh();
      await fixture.whenStable();
      expect(mockDogService.getRandomDog).toHaveBeenCalledTimes(2);
      expect(mockDogService.getRandomDogs).toHaveBeenCalledTimes(2);
    });
  });
});
