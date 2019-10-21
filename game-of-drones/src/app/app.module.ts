
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameConfigurationComponent } from './game-configuration/game-configuration.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { GameWinnerComponent } from './game-winner/game-winner.component';
@NgModule({
  declarations: [
    AppComponent,
    GameConfigurationComponent,
    PlayGameComponent,
    GameWinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
