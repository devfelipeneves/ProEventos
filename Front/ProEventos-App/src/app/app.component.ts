import { Component, Inject, Renderer2 } from '@angular/core';
import { User } from './models/identity/User';
import { AccountService } from './services/account.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private isDark = false;

  constructor(public accountService: AccountService,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  modoDark(isDarkMode: boolean) {
    this.isDark = isDarkMode;
    const hostClass = isDarkMode ? 'bg-dark theme-dark mat-typography' : 'bg-light theme-light mat-typography';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }

  setCurrentUser(): void {
    let user: User;

    if (localStorage.getItem('user'))
      user = JSON.parse(localStorage.getItem('user') ?? '{}');
    else
      user = null as any;

    if (user)
    this.accountService.setCurrentUser(user);
  }

}
