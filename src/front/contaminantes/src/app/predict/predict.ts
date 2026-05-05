import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-predict',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './predict.html'
})
export class PredictComponent implements OnInit {
  idUsuario: string | null = '';

  listaMunicipios: string[] = [];
  listaContaminantes: string[] = [];
  listaAreas: string[] = [];
  listaEstaciones: string[] = [];

  fecha: string = new Date().toISOString().split('T')[0];
  municipio: string = '';
  contaminante: string = '';
  tipo_area: string = '';
  tipo_estacion: string = '';
  valor_contaminante: number = 0.04;

  resultadoPrediccion: string = '';
  mensajeExito: string = '';
  errorMessage: string = '';
  cargandoOpciones: boolean = true;

  empresaActual: string = '';
  mostrarModal: boolean = false;
  grafanaUrlSegura!: SafeResourceUrl;

  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('usuario_logeado');
    if (!this.idUsuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.empresaActual = localStorage.getItem('empresa_logeada') || '';
    const baseUrl = 'http://localhost:3000/d/adkn27k/historico-mediciones?orgId=1&panelId=1&kiosk';
    const urlConFiltro = `${baseUrl}&var-empresa=${encodeURIComponent(this.empresaActual)}`;
    this.grafanaUrlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(urlConFiltro);

    this.cargarDiccionarios();
  }

  cargarDiccionarios() {
    this.cargandoOpciones = true;
    this.http.get<any>('http://localhost:5001/api/opciones').subscribe({
      next: (res) => {
        if (res.success) {
          this.listaMunicipios = res.municipios;
          this.listaContaminantes = res.contaminantes;
          this.listaAreas = res.areas;
          this.listaEstaciones = res.estaciones;

          if (this.listaMunicipios.length > 0) this.municipio = this.listaMunicipios[0];
          if (this.listaContaminantes.length > 0) this.contaminante = this.listaContaminantes[0];
          if (this.listaAreas.length > 0) this.tipo_area = this.listaAreas[0];
          if (this.listaEstaciones.length > 0) this.tipo_estacion = this.listaEstaciones[0];
          
          this.cargandoOpciones = false;
        }
      },
      error: (err) => {
        console.error("Error cargando diccionarios:", err);
        this.errorMessage = "No se pudieron obtener las opciones del servidor. Revisa el Backend.";
        this.cargandoOpciones = false;
      }
    });
  }

  hacerPrediccion() {
    this.errorMessage = '';
    this.resultadoPrediccion = '';
    this.mensajeExito = '';

    const payload = {
      id_usuario: this.idUsuario,
      fecha: this.fecha,
      municipio: this.municipio,
      contaminante: this.contaminante,
      tipo_area: this.tipo_area,
      tipo_estacion: this.tipo_estacion,
      valor_contaminante: this.valor_contaminante
    };

    this.http.post<any>('http://localhost:5001/api/predict', payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.resultadoPrediccion = res.resultado;
          this.mensajeExito = res.mensaje;
        } else {
          this.errorMessage = res.error || "La predicción no pudo ser procesada.";
        }
      },
      error: (err) => {
        console.error("Error en predicción:", err);
        this.errorMessage = err.error?.error || "Error de comunicación con el servicio";
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('usuario_logueado');
    this.router.navigate(['/login']);
  }

  abrirHistorico() {
    this.mostrarModal = true;
  }

  cerrarHistorico() {
    this.mostrarModal = false;
  }

}