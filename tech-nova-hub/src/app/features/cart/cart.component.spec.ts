// src/app/features/cart/cart.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from 'app/core/services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from 'app/core/models/cart-item';

// Mock CartService
class MockCartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  updateQuantity(_productId: string, _quantity: number) {}
  removeFromCart(_productId: string) {}
  clearCart() {}
  getTotalCost(): number {
    return 0;
  }

  setCartItems(items: CartItem[]) {
    this.cartItemsSubject.next(items);
  }
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: MockCartService;

  beforeEach(async () => {
    cartService = new MockCartService();

    await TestBed.configureTestingModule({
      imports: [
        CartComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: CartService, useValue: cartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty cart message when cartItems is empty', () => {
    component.cartItems = [];
    fixture.detectChanges();
    const emptyMessage = fixture.nativeElement.querySelector('p');
    expect(emptyMessage.textContent).toContain('Your cart is empty.');
  });

  it('should display cart items when cartItems is not empty', () => {
    const mockCartItems: CartItem[] = [
      {
        product: {
          id: '1',
          name: 'Apple Watch Ultra 2',
          price: 799.00,
          description: 'A rugged smartwatch for extreme sports.',
          imageUrls: ['https://via.placeholder.com/300?text=Apple+Watch+Ultra+2'],
          category: 'Smartwatches',
          priceHistory: [{ date: '2025-04-10', price: 799.00 }],
          reviews: [
            { user: 'John Doe', rating: 5, comment: 'Great watch!', date: '2025-04-10' },
            { user: 'Jane Smith', rating: 4, comment: 'Very durable', date: '2025-04-09' },
          ],
        },
        quantity: 1,
      },
    ];
    cartService.setCartItems(mockCartItems);
    fixture.detectChanges();
    const cartItems = fixture.nativeElement.querySelectorAll('.cart-item');
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].querySelector('mat-card-title').textContent).toContain('Apple Watch Ultra 2');
  });

  it('should call increaseQuantity when plus button is clicked', () => {
    const mockCartItems: CartItem[] = [
      {
        product: {
          id: '1',
          name: 'Apple Watch Ultra 2',
          price: 799.00,
          description: 'A rugged smartwatch for extreme sports.',
          imageUrls: ['https://via.placeholder.com/300?text=Apple+Watch+Ultra+2'],
          category: 'Smartwatches',
          priceHistory: [{ date: '2025-04-10', price: 799.00 }],
          reviews: [
            { user: 'John Doe', rating: 5, comment: 'Great watch!', date: '2025-04-10' },
            { user: 'Jane Smith', rating: 4, comment: 'Very durable', date: '2025-04-09' },
          ],
        },
        quantity: 1,
      },
    ];
    cartService.setCartItems(mockCartItems);
    spyOn(component, 'increaseQuantity');
    fixture.detectChanges();
    const plusButton = fixture.nativeElement.querySelectorAll('.quantity-selector button')[1];
    plusButton.click();
    expect(component.increaseQuantity).toHaveBeenCalledWith(mockCartItems[0]);
  });

  it('should call decreaseQuantity when minus button is clicked', () => {
    const mockCartItems: CartItem[] = [
      {
        product: {
          id: '1',
          name: 'Apple Watch Ultra 2',
          price: 799.00,
          description: 'A rugged smartwatch for extreme sports.',
          imageUrls: ['https://via.placeholder.com/300?text=Apple+Watch+Ultra+2'],
          category: 'Smartwatches',
          priceHistory: [{ date: '2025-04-10', price: 799.00 }],
          reviews: [
            { user: 'John Doe', rating: 5, comment: 'Great watch!', date: '2025-04-10' },
            { user: 'Jane Smith', rating: 4, comment: 'Very durable', date: '2025-04-09' },
          ],
        },
        quantity: 1,
      },
    ];
    cartService.setCartItems(mockCartItems);
    spyOn(component, 'decreaseQuantity');
    fixture.detectChanges();
    const minusButton = fixture.nativeElement.querySelectorAll('.quantity-selector button')[0];
    minusButton.click();
    expect(component.decreaseQuantity).toHaveBeenCalledWith(mockCartItems[0]);
  });
});
