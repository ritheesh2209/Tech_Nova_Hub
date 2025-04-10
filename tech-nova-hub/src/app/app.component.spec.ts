import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { WishlistService } from './core/services/wishlist.service';
import { of, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

describe('AppComponent', () => {
  let titleService: Title;

  beforeEach(async () => {
    const titleServiceMock = {
      setTitle: jasmine.createSpy('setTitle')
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1' // Mock paramMap.get for any route parameters
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
      imports: [
        AppComponent,
        RouterOutlet,
        HeaderComponent,
        FooterComponent
      ],
      providers: [
        provideRouter([]), // Provide router with no routes
        { provide: Location, useClass: SpyLocation }, // Provide a spy for Location
        { provide: Title, useValue: titleServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock }, // Provide the updated router mock
        { provide: CartService, useValue: cartServiceMock },
        { provide: WishlistService, useValue: wishlistServiceMock }
      ]
    }).compileComponents();

    titleService = TestBed.inject(Title);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'tech-nova-hub' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('tech-nova-hub');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, tech-nova-hub');
  });

  it('should set the document title to TechNova Hub', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
    expect(titleService.setTitle).toHaveBeenCalledWith('TechNova Hub');
  });
});
