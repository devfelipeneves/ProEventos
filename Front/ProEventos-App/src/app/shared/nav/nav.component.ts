import { Component, EventEmitter, OnInit, Output, Renderer2, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/identity/User';
import { AccountService } from '@app/services/account.service';
import {ThemePalette} from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  user!: User;
  private isDark = false;

  @Output()
  readonly temaDark = new EventEmitter<boolean>();

  constructor(public accountService: AccountService,
              private router: Router,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  modoDark({checked}: MatSlideToggleChange) {
    this.temaDark.emit(checked);
    this.isDark = checked;
    const hostClass = checked ? 'navbar navbar-expand-lg navbar-dark bg-dark shadow-sm' : 'navbar navbar-expand-lg navbar-light bg-light shadow-sm';
    this.renderer.setAttribute(this.document.getElementById("navbartheme"), 'class', hostClass);
  }

  public logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  public showMenu(): boolean {
    return this.router.url !== '/user/login';
  }

  public register(): boolean {
    return this.router.url === (('/user/registration') || ('/user/login'));
  }

  public carregarUsuario(): void {
    this.accountService.currentUser$.subscribe(
      (response: User) => this.user = response
    )
  }

}
