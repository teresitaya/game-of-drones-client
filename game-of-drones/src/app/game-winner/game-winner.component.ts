import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

import { locale as spanish} from './i18n/game-winner.es';
import { locale as english} from './i18n/game-winner.en';

@Component({
  selector: 'app-game-winner',
  templateUrl: './game-winner.component.html',
  styleUrls: ['./game-winner.component.css']
})
export class GameWinnerComponent implements OnInit {
  public winner: string;

  constructor(private translate: TranslateService, private route: ActivatedRoute, private router: Router ) {
    this.translate.setTranslation('es', spanish);
    this.translate.setTranslation('en', english);
    this.route.paramMap.subscribe(params => {
      this.winner = params.get('winner');
    });
  }

  ngOnInit() {
  }
  public newMatch(): void {
    const path = `/`;
    this.router.navigate([path]);
  }

}
