import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { Title } from '@angular/platform-browser';
import { CartService } from './core/services/cart.service';
import { WishlistService } from './core/services/wishlist.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let titleService: Title;

  beforeEach(async () => {
    const titleServiceMock = {
      setTitle: jasmine.createSpy('setTitle')
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterOutlet,
        HeaderComponent,
        FooterComponent
      ],
      providers: [
        { provide: Title, useValue: titleServiceMock },
        { provide: CartService, useValue: { cartItems$: of([]) } },
        { provide: WishlistService, useValue: { wishlistItems$: of([]) } }
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
