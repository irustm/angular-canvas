import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DomTestComponent } from './dom-test/dom-test/dom-test.component';
import { RouterModule } from '@angular/router';
import { GameModule } from './game/game.module';

@NgModule({
  declarations: [AppComponent, DomTestComponent],
  imports: [
    BrowserModule,
    GameModule,
    RouterModule.forRoot([
      {
        path: '',
        component: AppComponent,
      },
      {
        path: 'graph',
        loadChildren: () =>
          import('./graph-example-module/graph-example.module').then(
            (m) => m.GraphExampleModule
          ),
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
