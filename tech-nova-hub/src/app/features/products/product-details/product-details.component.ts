import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  isInWishlist: boolean = false;
  isInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(productId).subscribe((product) => {
        this.product = product;
        if (this.product) {
          this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
          this.isInCart = this.cartService.isInCart(this.product.id);
        }
      });
    }
  }

  toggleWishlist(): void {
    if (!this.product) return;
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
    this.isInWishlist = !this.isInWishlist;
  }

  toggleCart(): void {
    if (!this.product) return;
    if (this.isInCart) {
      this.cartService.removeFromCart(this.product.id);
    } else {
      this.cartService.addToCart(this.product);
    }
    this.isInCart = !this.isInCart;
  }
}
