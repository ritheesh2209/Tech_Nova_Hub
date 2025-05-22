import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
export { bootstrapApplication } from '@angular/platform-browser';
export { AppComponent } from './app/app.component'; // this is from featutre branch
