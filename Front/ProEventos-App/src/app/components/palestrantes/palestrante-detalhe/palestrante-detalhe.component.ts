import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {

  public form!: FormGroup;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  public get f(): any { return this.form.controls };

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  public ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  private validation(): void {
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }

  private verificaForm(): void {
    this.form.valueChanges
      .pipe(
        map(() => {
          this.situacaoDoForm = 'Minicurrículo está sendo Atualizado!';
          this.corDaDescricao = 'text-warning';
        }),
        debounceTime(1000),
        tap(() => this.spinner.show())
      ).subscribe(
        () => {
          this.palestranteService
            .salvarPalestrante('putPalestrante', {... this.form.value})
            .subscribe(
              () => {
                this.situacaoDoForm = 'Minicurrículo foi Atualizado!';
                this.corDaDescricao = 'text-success';

                setTimeout(() => {
                  this.situacaoDoForm = 'Minicurrículo foi Carregado!';
                  this.corDaDescricao = 'text-mute';
                }, 2000);

              },
              () => {
                this.toastr.error('Erro ao tentar Atualizar Palestrante', 'Erro!');
              }
            ).add(() => this.spinner.hide());
        }
      )
  }

  private carregarPalestrante(): void {
    this.spinner.show();

    this.palestranteService.getPalestrante().subscribe(
      (palestrante: Palestrante) => {
        this.form.patchValue(palestrante);
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar o Palestrante', 'Erro!')
        console.error(error);
      }
    ).add(() => this.spinner.hide())
  }

}
