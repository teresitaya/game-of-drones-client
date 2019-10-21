import { MoveModel } from './../models/move';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RoundModel } from './../models/round';
import { locale as spanish } from './i18n/play-game.es';
import { locale as english } from './i18n/play-game.en';
import { PlayGameService } from './play-game.service';
import { GameConfigurationService } from './../game-configuration/game-configuration.service';
import * as _ from 'underscore';


@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {
  @Input()
  public players: any;
  public move: any;
  public moves: any;
  public round: RoundModel;
  public currentPlayer: string;
  public currentPlayerClass: string;
  public playForm: FormGroup;
  public submitted: boolean;
  public registered: boolean;
  public serviceError: any;
  public matchId: number;
  public roundMoves: any;
  public rules: any;
  public showRoundResult: boolean;
  public rounds: any;
  public matchRounds: any;

  constructor(private translate: TranslateService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
    private playGameService: PlayGameService, private gameConfigurationService: GameConfigurationService) {
    this.translate.setTranslation('es', spanish);
    this.translate.setTranslation('en', english);
    this.moves = [{ id: 0, move: 'Rock' }, { id: 1, move: 'Paper' }, { id: 2, move: 'Scissors' }];
    this.round = new RoundModel();
    this.rounds = [];
    this.roundMoves = [];
    this.matchRounds = [];
    this.route.paramMap.subscribe(params => {
      this.players = params.get('players');
      this.players = this.players.split(',');
      this.matchId = Number(params.get('matchId'));
    });
    this.playGameService.getRules().subscribe((data: any) => {
      this.rules = data.rules;
    });
  }

  ngOnInit() {
    this.playForm = this.formBuilder.group({
      moves: ['', Validators.required]
    });
    this.showCurrentPlayer();
    this.showRoundResult = this.rounds.length > 0 ? true : false;
    this.checkMatchStatus();
  }

  private saveMatchWinner(winner: string): void {
    const data: any = Object.assign({rounds: this.matchRounds, winner: {name: winner}}, {id: this.matchId});
    this.gameConfigurationService.putMatch(data).subscribe((data: any) => {
      const path = `/winner/`;
      this.router.navigate([path, {winner : winner}]);
    });
  }
  public checkMatchStatus(): void {
    const winnersByRounds = _.groupBy(this.matchRounds, function (round) {
      return round.winnername;
    });
    console.group(`winnersByRounds`);
    console.log(JSON.stringify(winnersByRounds));
    if (winnersByRounds[this.players[0]] && winnersByRounds[this.players[0]].length >= 3) {
      console.log(`The winner is ${winnersByRounds[this.players[0]][0].winnername}`);
      this.saveMatchWinner(winnersByRounds[this.players[0]][0].winnername);
    } else {
      if (winnersByRounds[this.players[1]] && winnersByRounds[this.players[1]].length >= 3) {
        console.log(`The winner is ${winnersByRounds[this.players[1]][0].winnername}`);
        this.saveMatchWinner(winnersByRounds[this.players[1]][0].winnername);
      }
    }

  }
  public showCurrentPlayer(): void {
    this.currentPlayer = this.round.movesCount === 0 ? this.players[0] : this.players[1];
    this.currentPlayerClass = this.round.movesCount === 0 ? 'player-1-label' : 'player-2-label';
  }
  public invalidSelectMove(): boolean {
    return (this.submitted && this.playForm.controls.moves.errors !== null);
  }

  private createRoundObject(): RoundModel {
    const movesCount = this.currentPlayer === this.players[0] ? 1 : 2;
    const tempRound = {
      winnerName: {},
      roundNumber: this.round.roundNumber,
      movesCount: movesCount,
      matchId: this.matchId,
      roundid: null
    };
    return new RoundModel(tempRound);
  }
  private createMoveObject(data): MoveModel {
    const movesCount = this.currentPlayer === this.players[0] ? 1 : 2;
    const properties = {
      player: this.currentPlayer, roundNumber: this.round.roundNumber || data.round.roundnumber, matchId: this.matchId,
      move: this.playForm.value.moves, movesCount: movesCount, roundId: data.round.id
    };
    const dataObj: any = Object.assign(properties, this.playForm.value);
    const moveObject = new MoveModel(dataObj);
    return moveObject;
  }

  private generateRoundResult(data): void {
    const movesByRound = _.groupBy(this.roundMoves, (round) => {
      return round.move.roundid;
    });
    _.each(movesByRound, (round: any) => {
      if (round[0].move.roundid === this.round.id) {
        let roundToPut = Object.assign({ winnerName: this.players[0] }, this.round);
        roundToPut = new RoundModel(roundToPut);
        if (round[0].move.move === round[1].move.move) {
          roundToPut.winnerName = this.translate.instant('play_game.TIE');
          this.playGameService.putRound(roundToPut).subscribe((data: any) => {
            this.showRoundResult = true;
            this.rounds.push(data.round);
            this.matchRounds.push(data.round);
            this.round.movesCount = 0;
            this.submitted = false;
            this.ngOnInit();
          });
        } else {
          this.rules.forEach(rule => {
            if (round[0].move.move === rule.move && round[1].move.move === rule.kills) {
              roundToPut.winnerName = round[0].move.player;
            } else {
              if (roundToPut.winnerName !== round[0].move.player) {
                roundToPut.winnerName = round[1].move.player;
              }

            }
          });
          this.playGameService.putRound(roundToPut).subscribe((data: any) => {
            this.showRoundResult = true;
            this.rounds.push(data.round);
            this.matchRounds.push(data.round);
            this.round.movesCount = 0;
            this.submitted = false;
            this.ngOnInit();
          });
        }
      }

    });
  }

  private saveMove(data): void {
    const move = this.createMoveObject(data);
    this.playGameService.saveMove(move).subscribe(async (data: any) => {
      this.roundMoves.push(data);
      if (this.round.movesCount > 1) {
        await this.generateRoundResult(data);
        this.round.roundNumber = Number(this.round.roundNumber) + 1;
      } else {
        this.round.movesCount = Number(this.round.movesCount) + 1;
        this.submitted = false;
        this.ngOnInit();
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.playForm.invalid) {
      return;
    } else {
      if (this.round.movesCount === 0) {
        this.round = this.createRoundObject();
        this.playGameService.createRound(this.round).subscribe((data: any) => {
          this.round = data.round;
          this.saveMove(data);
        });
      } else {
        this.playGameService.getRound(this.round.id).subscribe((data: any) => {
          this.saveMove(data);
        });
      }

    }
  }


}
