import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/authentification/login/login.component';
import { RegisterComponent } from './pages/authentification/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GlobalService } from './services/global.service';
import { HomeComponent } from './pages/main/home/home.component';
import { LogoutComponent } from './pages/authentification/logout/logout.component';
import { GuestDirective } from './directives/guest.directive';
import { UserDirective } from './directives/user.directive';
import { EmailConfirmationComponent } from './pages/authentification/email-confirmation/email-confirmation.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		HomeComponent,
		LogoutComponent,
		GuestDirective,
		UserDirective,
		EmailConfirmationComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		HttpClientModule
	],
	providers: [
		GlobalService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
