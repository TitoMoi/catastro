import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CatastroService } from './services/catastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string;
  constructor(private catastroService: CatastroService) {
    this.title = 'catastro';
  }
  ngOnInit(): void {}
}
