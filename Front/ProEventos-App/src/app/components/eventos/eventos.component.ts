import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
  // providers: [EventoService]
})
export class EventosComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  botaoListar(): boolean {
    return this.router.url != '/eventos/lista';
  }

}
