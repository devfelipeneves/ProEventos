import { HttpStatusCode } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RedeSocial } from '@app/models/RedeSocial';
import { RedeSocialService } from '@app/services/redeSocial.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redesSociais',
  templateUrl: './redesSociais.component.html',
  styleUrls: ['./redesSociais.component.scss']
})
export class RedesSociaisComponent implements OnInit {

  modalRef!: BsModalRef;
  @Input() eventoId = 0;
  public formRS!: FormGroup;
  public redeSocialAtual = { id: 0, nome: '', indice: 0};
  ocultarBotao: boolean = true;

  public get redesSociais(): FormArray {
    return this.formRS.get('redesSociais') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private redeSocialService: RedeSocialService
  ) { }

  ngOnInit() {
    this.carregarRedesSociais(this.eventoId);
    this.validation();
  }

  public carregar(): void {
    this.carregarRedesSociais(this.eventoId);
  }

  private carregarRedesSociais(id: number = 0): void {
      this.ocultarBotao = false;
      let origem = 'palestrante';

      if (this.eventoId !== 0) origem = 'evento';

      this.spinner.show();

      this.redeSocialService
        .getRedesSociais(origem, id)
        .subscribe(
          (redeSocialRetorno: RedeSocial[]) => {

            redeSocialRetorno.forEach((redeSocial) => {
              this.redesSociais.push(this.criarRedeSocial(redeSocial));
            });
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar carregar Redes Sociais', 'Erro!');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
  }

  public validation(): void {
    this.formRS = this.fb.group({
      redesSociais: this.fb.array([]),
    })
  }

  public adicionarRedeSocial(): void {
    this.redesSociais.push(this.criarRedeSocial({id: 0} as RedeSocial));
  }

  public criarRedeSocial(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    })
  }

  public retornaTitulo(nome: string): string {
    return nome === null || nome === '' ? 'Rede Social' : nome;
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null) : any {
    return {'is-invalid': campoForm?.errors && campoForm?.touched};
  }

  public salvarRedesSociais(): void {
    if (this.formRS.controls.redesSociais.valid) {
      let origem = 'Palestrante';

      if (this.eventoId !== 0) origem = 'Evento';

      this.spinner.show();
      this.redeSocialService.saveRedesSociais(origem, this.eventoId, this.formRS.value.redesSociais).subscribe(
        () => {
          this.toastr.success('Redes Sociais foram salvas com Sucesso!', 'Sucesso!');
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar salvar Redes Sociais.', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public removerRedeSocial(template: TemplateRef<any>, indice: number): void {

    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id')?.value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome')?.value;
    this.redeSocialAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm' });
  }

  public confirmDeleteRedeSocial(): void {
    let origem = 'Palestrante';

    this.modalRef?.hide();
    this.spinner.show();

    if (this.eventoId !== 0) origem = 'Evento';

    this.redeSocialService.deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id).subscribe(
      () => {
        this.toastr.success('Rede Social deletado com sucesso.', 'Sucesso!');
        this.redesSociais.removeAt(this.redeSocialAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar Rede Social ${this.redeSocialAtual.id}`, 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  public declineDeleteRedeSocial(): void {
    this.modalRef?.hide();
  }

}
