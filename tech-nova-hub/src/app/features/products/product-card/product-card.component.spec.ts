// src/app/features/product-card/product-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from 'app/core/services/cart.service';
import { WishlistService } from 'app/core/services/wishlist.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let router: Router;
  let cartService: jasmine.SpyObj<CartService>;
  let wishlistService: jasmine.SpyObj<WishlistService>;
  let wishlistItemsSubject: BehaviorSubject<any[]>;
  let cartItemsSubject: BehaviorSubject<any[]>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    wishlistItemsSubject = new BehaviorSubject<any[]>([]);
    cartItemsSubject = new BehaviorSubject<any[]>([]);

    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart', 'removeFromCart', 'isInCart'], {
      cartItems$: cartItemsSubject.asObservable(),
    });
    const wishlistServiceSpy = jasmine.createSpyObj('WishlistService', ['addToWishlist', 'removeFromWishlist', 'isInWishlist'], {
      wishlistItems$: wishlistItemsSubject.asObservable(),
    });

    cartServiceSpy.isInCart.and.returnValue(false);
    wishlistServiceSpy.isInWishlist.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        ProductCardComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: WishlistService, useValue: wishlistServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    wishlistService = TestBed.inject(WishlistService) as jasmine.SpyObj<WishlistService>;

    // Set the product input before detectChanges
    component.product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      description: 'Test Description',
      category: 'Test Category',
      imageUrls: ['/assets/test-image.jpg'],
      priceHistory: [],
      reviews: [],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product details', () => {
    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card.textContent).toContain('Test Product');
    expect(card.textContent).toContain('$100.00');
  });

  it('should navigate to product details when card is clicked', () => {
    const card = fixture.nativeElement.querySelector('mat-card');
    card.click();
    expect(router.navigate).toHaveBeenCalledWith(['/products', '1']);
  });

  it('should show "Add to Wishlist" tooltip when product is not in wishlist', () => {
    const wishlistTooltip = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(1) .custom-tooltip');
    expect(wishlistTooltip.textContent).toBe('Add to Wishlist');
  });

  it('should show "Remove from Wishlist" tooltip when product is in wishlist', () => {
    // Emit new value to simulate product in wishlist
    wishlistItemsSubject.next([{ id: '1', name: 'Test Product', price: 100, description: '', category: '', imageUrls: [], priceHistory: [], reviews: [] }]);
    fixture.detectChanges();
    const wishlistTooltip = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(1) .custom-tooltip');
    expect(wishlistTooltip.textContent).toBe('Remove from Wishlist');
  });

  it('should show "Add to Cart" tooltip when product is not in cart', () => {
    const cartTooltip = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(2) .custom-tooltip');
    expect(cartTooltip.textContent).toBe('Add to Cart');
  });

  it('should show "Remove from Cart" tooltip when product is in cart', () => {
    // Emit new value to simulate product in cart
    cartItemsSubject.next([{ product: { id: '1', name: 'Test Product', price: 100, description: '', category: '', imageUrls: [], priceHistory: [], reviews: [] }, quantity: 1 }]);
    fixture.detectChanges();
    const cartTooltip = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(2) .custom-tooltip');
    expect(cartTooltip.textContent).toBe('Remove from Cart');
  });

  it('should toggle wishlist status when wishlist button is clicked', () => {
    spyOn(component, 'toggleWishlist');
    const wishlistButton = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(1) button');
    wishlistButton.click();
    expect(component.toggleWishlist).toHaveBeenCalled();
  });

  it('should toggle cart status when cart button is clicked', () => {
    spyOn(component, 'toggleCart');
    const cartButton = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(2) button');
    cartButton.click();
    expect(component.toggleCart).toHaveBeenCalled();
  });

  it('should not navigate when wishlist button is clicked', () => {
    const wishlistButton = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(1) button');
    wishlistButton.click();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate when cart button is clicked', () => {
    const cartButton = fixture.nativeElement.querySelector('mat-card-actions .tooltip-wrapper:nth-child(2) button');
    cartButton.click();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
