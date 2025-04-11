import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ProductCardComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  sortBy: string = 'default';
  category: string = 'all';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  filterProducts(): void {
    let tempProducts = [...this.products];

    // Filter by search term
    if (this.searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (this.category !== 'all') {
      tempProducts = tempProducts.filter(product =>
        product.category.toLowerCase() === this.category.toLowerCase()
      );
    }

    // Sort products
    if (this.sortBy === 'price-asc') {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'name-asc') {
      tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'name-desc') {
      tempProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    this.filteredProducts = tempProducts;
  }
}
