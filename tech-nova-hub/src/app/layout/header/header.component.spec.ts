import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { of, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    const cartServiceMock = {
      cartItems$: of([]),
      isInCart: () => false
    };

    const wishlistServiceMock = {
      wishlistItems$: of([]),
      isInWishlist: () => false
    };

    const routerEventsSubject = new Subject(); // For router events
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
      events: routerEventsSubject.asObservable(), // Mock the events Observable
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}), // Mock createUrlTree
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('/mock-url') // Mock serializeUrl
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]), // Provide router with no routes
        { provide: Location, useClass: SpyLocation }, // Provide a spy for Location
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock }, // Provide the updated router mock
        { provide: CartService, useValue: cartServiceMock },
        { provide: WishlistService, useValue: wishlistServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
