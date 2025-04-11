import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from 'app/core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  isDarkMode: boolean;
  private isBrowser: boolean;

  constructor(
    private elementRef: ElementRef,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.removeTechNovaHubText();
      const observer = new MutationObserver(() => {
        this.removeTechNovaHubText();
      });
      const headerContainer = this.elementRef.nativeElement.querySelector('.header-container');
      if (headerContainer) {
        observer.observe(headerContainer, {
          childList: true,
          subtree: true
        });
      }
    }
  }

  private removeTechNovaHubText() {
    const links = this.elementRef.nativeElement.querySelectorAll('.header-container > a[href="/"]');
    links.forEach((link: HTMLElement) => {
      if (link.textContent?.trim() === 'tech-nova-hub') {
        link.remove();
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }
}
