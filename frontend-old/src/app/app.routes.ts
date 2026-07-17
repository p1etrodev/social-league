import { ChampionsComponent } from './views/champions/champions.component';
import { HomeComponent } from './views/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { PostComponent } from './views/post/post.component';
import { ProfileComponent } from './views/profile/profile.component';
import { QuotesComponent } from './views/quotes/quotes.component';
import { Routes } from '@angular/router';

// import { championIdResolver } from './resolvers/champion-id.resolver';
// import { postIdResolver } from './resolvers/post-id.resolver';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio | Social League',
    component: HomeComponent,
  },
  {
    path: 'champions',
    children: [
      {
        path: '',
        component: ChampionsComponent,
      },
      {
        path: ':id',
        component: ProfileComponent,
        // FIXME
        // resolve: { valid: championIdResolver },
      },
    ],
  },
  {
    path: 'post/:id',
    // FIXME
    // resolve: { valid: postIdResolver },
    children: [
      {
        path: '',
        component: PostComponent,
      },
      {
        path: 'quotes',
        component: QuotesComponent,
      },
    ],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
