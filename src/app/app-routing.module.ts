import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './pages/authentification/register/register.component';
import { LoginComponent } from './pages/authentification/login/login.component';
import { HomeComponent } from './pages/main/home/home.component';
import { LogoutComponent } from './pages/authentification/logout/logout.component';
import { EmailConfirmationComponent } from './pages/authentification/email-confirmation/email-confirmation.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'email-confirm/:token',
		component: EmailConfirmationComponent
	},
	{
		path: 'logout',
		component: LogoutComponent
	},
	{
		path: '',
		redirectTo: '/',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
