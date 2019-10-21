import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

import { locale as english } from './i18n/game-configuration.en';
import { locale as spanish } from './i18n/game-configuration.es';
import { GameConfigurationService } from './game-configuration.service';
import { PlayerModel } from './../models/player';

@Component({
  selector: 'app-game-configuration',
  templateUrl: './game-configuration.component.html',
  styleUrls: ['./game-configuration.component.css']
})
export class GameConfigurationComponent implements OnInit {
  public gameConfigForm: FormGroup;
  public serviceError: any;
  public submitted: boolean;
  public guid: any;
  public registered: boolean;
  public players: string [];

  constructor(private translate: TranslateService, private formBuilder: FormBuilder,
    private gameConfigurationService: GameConfigurationService, private router: Router) {
    this.translate.setTranslation('es', spanish);
    this.translate.setTranslation('en', english);
  }
  public invalidFirstPlayer(): boolean {
    return (this.submitted && (this.serviceError.player1 !== null && this.gameConfigForm.controls.player1.errors !== null));
  }

  public invalidSecondPlayer(): boolean {
    return (this.submitted && (this.serviceError.player2 !== null && this.gameConfigForm.controls.player2.errors !== null));
  }

  private createPlayer(playerName): PlayerModel {
    const playerObject = Object.assign({name: playerName});
    this.players.push(playerObject.name);
    return new PlayerModel(playerObject);
  }
  ngOnInit() {
    this.gameConfigForm = this.formBuilder.group({
      player1: ['', Validators.required],
      player2: ['', Validators.required]
    });
    this.serviceError = {};
    this.submitted = false;
    this.players = [];
  }

  onSubmit() {
    this.submitted = true;

    if (this.gameConfigForm.invalid) {
      return;
    } else {
      const data: any = Object.assign({winner: {}, rounds: []}, this.gameConfigForm.value);
      const player1 = this.createPlayer(this.gameConfigForm.value.player1);
      const player2 = this.createPlayer(this.gameConfigForm.value.player2);
      data.player1 = player1;
      data.player2 = player2;
      this.gameConfigurationService.createMatch(data).subscribe((data: any) => {
        const path = `/play/`;
        this.router.navigate([path, {players : this.players, matchId: data.match.id}]);
      }, error => {
        this.serviceError = error;
      });
      this.registered = true;
    }
  }
  }
