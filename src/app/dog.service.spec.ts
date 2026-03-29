import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DogService, DogImage } from './dog.service';

describe('DogService', () => {
  let service: DogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('extractBreed', () => {
    it('should capitalize a single-word breed slug', () => {
      const url = 'https://images.dog.ceo/breeds/labrador/n02099712_1.jpg';
      expect(service.extractBreed(url)).toBe('Labrador');
    });

    it('should reverse and capitalize a compound breed slug', () => {
      const url = 'https://images.dog.ceo/breeds/spaniel-cocker/n02102973_898.jpg';
      expect(service.extractBreed(url)).toBe('Cocker Spaniel');
    });

    it('should handle three-part breed slugs', () => {
      const url = 'https://images.dog.ceo/breeds/terrier-fox-toy/n02097658_1.jpg';
      expect(service.extractBreed(url)).toBe('Toy Fox Terrier');
    });

    it('should return "Unknown" for a URL that does not match the breeds pattern', () => {
      expect(service.extractBreed('https://example.com/not-a-dog-url')).toBe('Unknown');
    });
  });

  describe('getRandomDog', () => {
    it('should GET from the correct endpoint', () => {
      service.getRandomDog().subscribe();
      const req = httpMock.expectOne('https://dog.ceo/api/breeds/image/random');
      expect(req.request.method).toBe('GET');
      req.flush({ message: 'https://images.dog.ceo/breeds/labrador/1.jpg', status: 'success' });
    });

    it('should map the response to a DogImage', () => {
      const imageUrl = 'https://images.dog.ceo/breeds/labrador/n02099712_1.jpg';
      let result: DogImage | undefined;
      service.getRandomDog().subscribe((dog) => (result = dog));

      const req = httpMock.expectOne('https://dog.ceo/api/breeds/image/random');
      req.flush({ message: imageUrl, status: 'success' });

      expect(result).toEqual({ url: imageUrl, breed: 'Labrador' });
    });
  });

  describe('getRandomDogs', () => {
    it('should GET from the endpoint with the correct count', () => {
      service.getRandomDogs(5).subscribe();
      const req = httpMock.expectOne('https://dog.ceo/api/breeds/image/random/5');
      expect(req.request.method).toBe('GET');
      req.flush({ message: [], status: 'success' });
    });

    it('should map the response array to an array of DogImages', () => {
      const imageUrls = [
        'https://images.dog.ceo/breeds/labrador/n02099712_1.jpg',
        'https://images.dog.ceo/breeds/spaniel-cocker/n02102973_898.jpg',
      ];
      let results: DogImage[] | undefined;
      service.getRandomDogs(2).subscribe((dogs) => (results = dogs));

      const req = httpMock.expectOne('https://dog.ceo/api/breeds/image/random/2');
      req.flush({ message: imageUrls, status: 'success' });

      expect(results).toHaveLength(2);
      expect(results![0]).toEqual({ url: imageUrls[0], breed: 'Labrador' });
      expect(results![1]).toEqual({ url: imageUrls[1], breed: 'Cocker Spaniel' });
    });
  });
});
