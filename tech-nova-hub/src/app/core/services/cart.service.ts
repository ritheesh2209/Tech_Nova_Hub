import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadCartFromStorage();
    }
  }

  private loadCartFromStorage(): void {
    if (!this.isBrowser) return;
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.cartSubject.next(this.cart);
    }
  }

  private saveCartToStorage(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  getCart(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product): void {
    if (!this.cart.some(item => item.id === product.id)) {
      this.cart.push(product);
      this.saveCartToStorage();
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cart = [];
    this.saveCartToStorage();
  }

  isInCart(productId: string): boolean {
    return this.cart.some(item => item.id === productId);
  }

  getTotalCost(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }
}
