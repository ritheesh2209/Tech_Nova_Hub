import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from 'app/core/models/product';
import { CartItem } from 'app/core/models/cart-item';
import { WishlistService } from 'app/core/services/wishlist.service';
import { CartService } from 'app/core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  isBrowser: boolean;
  isInWishlist: boolean = false;
  isInCart: boolean = false;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.isInWishlist = items.some(item => item.id === this.product.id);
    });

    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.isInCart = items.some(item => item.product.id === this.product.id);
    });
  }

  onSelect() {
    this.router.navigate(['/products', this.product.id]);
  }

  toggleWishlist() {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
  }

  toggleCart() {
    if (this.isInCart) {
      this.cartService.removeFromCart(this.product.id);
    } else {
      this.cartService.addToCart(this.product);
    }
  }
}
