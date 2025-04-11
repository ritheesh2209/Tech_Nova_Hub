import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from 'app/core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: () => of([
        {
          id: '1',
          name: 'Test Product',
          price: 100,
          description: 'Test Description',
          category: 'Test Category',
          imageUrls: ['test-image.jpg'],
          priceHistory: [],
          reviews: []
        }
      ])
    };

    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
