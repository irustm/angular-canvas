import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DomTestComponent } from './dom-test/dom-test/dom-test.component';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [AppComponent, DomTestComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        component: AppComponent,
      },
      {
        path: 'graph',
        loadChildren: () =>
          import('./graph/graph.module').then((m) => m.GraphModule),
      },
      {
        path: 'game',
        loadChildren: () =>
          import('./game/game.module').then((m) => m.GameModule),
      },
    ]),
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
