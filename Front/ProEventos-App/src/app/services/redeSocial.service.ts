import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialService {

  baseURL = environment.apiURL + 'api/redesSociais';

constructor(private http: HttpClient) { }

  /**
   *
   * @param origem Precisa passar a palavra 'palestrante' ou 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou EventoId dependendo da sua origem.
   * @returns Observable<RedeSocial[]>
   */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]> {
    let URL =
      id === 0
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`;

    return this.http
      .get<RedeSocial[]>(URL)
      .pipe(take(1));
  }

  /**
   *
   * @param origem Precisa passar a palavra 'palestrante' ou 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou EventoId dependendo da sua origem.
   * @param redesSociais Precisa adicionar Redes Sociais organizadas em RedeSocial[].
   * @returns Observable<RedeSocial[]>
   */
   public saveRedesSociais(origem: string, id: number, redesSociais: RedeSocial[]): Observable<RedeSocial[]> {
    let URL =
      id === 0
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`;

    return this.http
      .put<RedeSocial[]>(URL, redesSociais)
      .pipe(take(1));
  }

  /**
   *
   * @param origem Precisa passar a palavra 'palestrante' ou 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou EventoId dependendo da sua origem.
   * @param redeSocialId Precisa usar o Id da Rede Social
   * @returns Observable<any>
   */
   public deleteRedeSocial(origem: string, id: number, redeSocialId: number): Observable<any> {
    let URL =
      id === 0
        ? `${this.baseURL}/${origem}/${redeSocialId}`
        : `${this.baseURL}/${origem}/${id}/${redeSocialId}`;

    return this.http
      .delete(URL)
      .pipe(take(1));
  }
}
