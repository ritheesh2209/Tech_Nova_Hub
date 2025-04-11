import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ProductService } from 'app/core/services/product.service';
import { WishlistService } from 'app/core/services/wishlist.service';
import { CartService } from 'app/core/services/cart.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Router } from '@angular/router';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1' // Mock the product ID
        }
      }
    };

    const productServiceMock = {
      getProduct: () => of({
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        category: 'Test Category',
        imageUrls: ['test-image.jpg'],
        priceHistory: [],
        reviews: []
      })
    };

    const wishlistServiceMock = {
      isInWishlist: () => false,
      addToWishlist: () => {},
      removeFromWishlist: () => {}
    };

    const cartServiceMock = {
      isInCart: () => false,
      addToCart: () => {},
      removeFromCart: () => {}
    };

    const routerEventsSubject = new Subject(); // For router events
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
      events: routerEventsSubject.asObservable(), // Mock the events Observable
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}), // Mock createUrlTree
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('/mock-url') // Mock serializeUrl
    };

    await TestBed.configureTestingModule({
      imports: [
        ProductDetailsComponent,
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        provideRouter([]), // Provide router with no routes
        { provide: Location, useClass: SpyLocation }, // Provide a spy for Location
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock }, // Provide the updated router mock
        { provide: ProductService, useValue: productServiceMock },
        { provide: WishlistService, useValue: wishlistServiceMock },
        { provide: CartService, useValue: cartServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
