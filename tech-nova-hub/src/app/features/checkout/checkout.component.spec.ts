import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { CartService } from 'app/core/services/cart.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartService: CartService;
  let router: Router;

  const mockCartItems = [
    {
      product: {
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        imageUrls: ['test-image.jpg'],
        category: 'Test Category',
        priceHistory: [],
        reviews: []
      },
      quantity: 2
    }
  ];

  beforeEach(async () => {
    const cartServiceMock = {
      cartItems$: of(mockCartItems),
      clearCart: jasmine.createSpy('clearCart'),
      getTotalCost: jasmine.createSpy('getTotalCost').and.returnValue(200)
    };

    const routerEventsSubject = new Subject();
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
      events: routerEventsSubject.asObservable(),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('/mock-url')
    };

    await TestBed.configureTestingModule({
      imports: [
        CheckoutComponent,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        provideRouter([]),
        { provide: Location, useClass: SpyLocation },
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    router = TestBed.inject(Router);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart items and total price', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.checkout-item mat-card-title')?.textContent).toContain('Test Product');
    expect(compiled.querySelector('.checkout-item mat-card-subtitle')?.textContent).toContain('$100.00 x 2 = $200.00');
    expect(compiled.querySelector('.checkout-item mat-card-content p')?.textContent).toContain('Test Description');
    expect(compiled.querySelector('.checkout-summary h3')?.textContent).toContain('Total Cost: $200.00');
  });

  it('should clear cart and show confirmation on confirm purchase', () => {
    const confirmButton = fixture.nativeElement.querySelector('.checkout-summary button');
    confirmButton.click();
    fixture.detectChanges();

    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.isCheckoutComplete).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.checkout-complete h3')?.textContent).toContain('Thank You for Your Purchase!');
  });

  it('should navigate to home when go to home button is clicked', () => {
    component.isCheckoutComplete = true;
    fixture.detectChanges();

    const homeButton = fixture.nativeElement.querySelector('.checkout-complete button');
    homeButton.click();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show empty cart message if cart is empty', () => {
    (cartService as any).cartItems$ = of([]);
    (cartService as any).getTotalCost.and.returnValue(0);
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Your cart is empty.');
  });
});