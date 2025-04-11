import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = '/products.json';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getRecommendations(product: Product): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.category === product.category && p.id !== product.id))
    );
  }
}
