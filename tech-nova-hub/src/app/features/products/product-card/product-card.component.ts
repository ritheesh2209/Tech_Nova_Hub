import { Component, EventEmitter, Input, Output, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../../core/models/product';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements AfterViewInit {
  @Input() product!: Product;
  @Output() productSelected = new EventEmitter<string>();
  viewerId: string;
  private pannellumLoaded = false;
  public isBrowser: boolean;
  public isInWishlist: boolean = false;
  public isInCart: boolean = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {
    this.viewerId = 'pannellum-' + Math.random().toString(36).substr(2, 9);
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return; // Skip Pannellum initialization on the server
    }

    // Load Pannellum script dynamically
    this.loadPannellumScript().then(() => {
      this.pannellumLoaded = true;
      this.initializeViewer();
    }).catch((error) => {
      console.error('Failed to load Pannellum script:', error);
    });

    // Check if the product is in the wishlist or cart
    this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
    this.isInCart = this.cartService.isInCart(this.product.id);
  }

  private loadPannellumScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof (window as any).pannellum !== 'undefined') {
        resolve();
        return;
      }

      const script = this.renderer.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error: any) => reject(error);
      this.renderer.appendChild(this.document.body, script);
    });
  }

  private initializeViewer(): void {
    if (this.pannellumLoaded && this.product?.imageUrls && this.product.imageUrls.length > 0) {
      (window as any).pannellum.viewer(this.viewerId, {
        type: 'equirectangular',
        panorama: this.product.imageUrls[0],
        autoLoad: true,
        autoRotate: -2
      });
    } else {
      console.error('Pannellum not loaded or no image URLs provided');
    }
  }

  onSelect(): void {
    this.productSelected.emit(this.product.id);
  }

  toggleWishlist(): void {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
    this.isInWishlist = !this.isInWishlist;
  }

  toggleCart(): void {
    if (this.isInCart) {
      this.cartService.removeFromCart(this.product.id);
    } else {
      this.cartService.addToCart(this.product);
    }
    this.isInCart = !this.isInCart;
  }
}
