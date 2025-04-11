import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: Product[] = [];
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadWishlistFromStorage();
    }
  }

  private loadWishlistFromStorage(): void {
    if (!this.isBrowser) return;
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
      this.wishlistItemsSubject.next(this.wishlist);
    }
  }

  private saveWishlistToStorage(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistItemsSubject.next(this.wishlist);
  }

  getWishlist(): Observable<Product[]> {
    return this.wishlistItems$;
  }

  addToWishlist(product: Product): void {
    if (!this.wishlist.some(item => item.id === product.id)) {
      this.wishlist.push(product);
      this.saveWishlistToStorage();
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    this.saveWishlistToStorage();
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.some(item => item.id === productId);
  }
}
