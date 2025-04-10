import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from 'app/core/services/cart.service';
import { WishlistService } from 'app/core/services/wishlist.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: CartService, useValue: { cartItems$: of([]), isInCart: () => false } },
        { provide: WishlistService, useValue: { wishlistItems$: of([]), isInWishlist: () => false } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;

    // Set the product input before detectChanges
    component.product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      description: 'Test Description',
      category: 'Test Category',
      imageUrls: ['test-image.jpg'],
      priceHistory: [],
      reviews: []
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
