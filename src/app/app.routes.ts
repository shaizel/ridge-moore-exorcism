import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'main-menu',
		pathMatch: 'full',
	},
	{
		path: 'main-menu',
		loadComponent: () =>
			import('./features/main-menu/main-menu.component').then((m) => m.MainMenuComponent),
	},
	{
		path: 'demo',
		loadComponent: () => import('./demo/demo').then((m) => m.Demo),
	},
    {
        path: '**',
        redirectTo: 'main-menu',
    }
];
