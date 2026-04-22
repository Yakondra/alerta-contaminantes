import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  idUsuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  hacerLogin() {
    this.errorMessage = '';
    const datosLogin = { id_usuario: this.idUsuario, password: this.password };

    this.http.post<any>('http://localhost:5001/api/login', datosLogin)
      .subscribe({
        next: (respuesta) => {
          if (respuesta.success) {
            localStorage.setItem('usuario_logeado', this.idUsuario);
            this.router.navigate(['/predict']);
          }
        },
        error: (errorRes) => {
          if (errorRes.error && errorRes.error.mensaje) {
            this.errorMessage = errorRes.error.mensaje;
          } else {
            this.errorMessage = "Error de conexión con el servidor.";
          }
        }
      });
  }
}