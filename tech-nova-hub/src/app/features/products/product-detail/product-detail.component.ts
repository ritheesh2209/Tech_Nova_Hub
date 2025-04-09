import { Component, OnInit, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  product: Product | undefined;
  viewerId: string = 'pannellum-viewer';
  public isBrowser: boolean;
  private pannellumLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProducts().subscribe((products) => {
        this.product = products.find(p => p.id === productId);
      });
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return; // Skip Pannellum initialization on the server
    }

    // Load Pannellum script dynamically
    this.loadPannellumScript().then(() => {
      this.pannellumLoaded = true;
      this.initializeViewer();
    }).catch((error) => {
      console.error('Failed to load Pannellum script:', error);
    });
  }

  private loadPannellumScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof (window as any).pannellum !== 'undefined') {
        // Pannellum is already loaded
        resolve();
        return;
      }

      const script = this.renderer.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error: any) => reject(error);
      this.renderer.appendChild(this.document.body, script);
    });
  }

  private initializeViewer(): void {
    if (this.pannellumLoaded && this.product && this.product.imageUrls && this.product.imageUrls.length > 0) {
      (window as any).pannellum.viewer(this.viewerId, {
        type: 'equirectangular',
        panorama: this.product.imageUrls[0],
        autoLoad: true,
        autoRotate: -2 // Optional: auto-rotate the view
      });
    } else {
      console.error('Pannellum not loaded or no image URLs provided');
    }
  }
}
