import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
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
      this.cartItemsSubject.next(this.cart);
    }
  }

  private saveCartToStorage(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartItemsSubject.next(this.cart);
  }

  getCart(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if product already exists
    } else {
      this.cart.push({ product, quantity: 1 }); // Add new item with quantity 1
    }
    this.saveCartToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId); // Remove item if quantity is 0 or less
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
      }
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cart = [];
    this.saveCartToStorage();
  }

  isInCart(productId: string): boolean {
    return this.cart.some(item => item.product.id === productId);
  }

  getTotalCost(): number {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
