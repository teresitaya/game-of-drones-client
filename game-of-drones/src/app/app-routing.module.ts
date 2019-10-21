
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameConfigurationComponent } from './game-configuration/game-configuration.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { GameWinnerComponent } from './game-winner/game-winner.component';

const routes: Routes = [
  {
    path: '',
    component: GameConfigurationComponent
},
{
  path: 'play',
  component: PlayGameComponent
},
{
  path: 'winner',
  component: GameWinnerComponent

}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
