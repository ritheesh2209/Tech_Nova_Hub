# Tech Nova Hub

Tech Nova Hub is an e-commerce web application built with Angular, designed to provide a seamless shopping experience for tech products. The application includes features like product browsing, cart management, wishlist functionality, and a checkout process.

## Features

- **Product Listing**: Browse a list of tech products with details like name, price, and image.
- **Product Details**: View detailed information about a product, including description, price history, and reviews.
- **Cart Management**:
  - Add products to the cart.
  - Update quantities or remove items from the cart.
  - Clear the cart.
- **Wishlist**: Add or remove products from a wishlist.
- **Checkout**:
  - View cart items with their total cost.
  - Confirm purchase to clear the cart and display a confirmation message.
  - Navigate back to the home page after purchase.
- **Theme Support**: Toggle between light and dark themes.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Framework**: Angular 17+
- **Styling**: SCSS with Angular Material for UI components
- **State Management**: RxJS (BehaviorSubject for cart and wishlist)
- **Testing**: Jasmine and Karma
- **Storage**: LocalStorage for persisting cart and wishlist data
- **Routing**: Angular Router with lazy loading

## Setup Instructions

### Prerequisites
- Node.js (v18.x or later)
- Angular CLI (v17.x or later)

### Installation

1. Clone the repository:
```
git clone https://github.com/ritheesh2209/Tech_Nova_Hub.git
```

2. Navigate to the main repository folder:
```
cd Tech_Nova_Hub
```

3. Navigate to the inner project directory where the Angular code is located:
```
cd tech-nova-hub
```

4. Install dependencies:
```
npm install
```

5. Run the development server:
```
ng serve
```

6. Open your browser and visit:
```
http://localhost:4200/
```

### Working with Branches

If you want to access a specific branch (like the feature/initial_branch):
```
git checkout feature/initial_branch
```
## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
