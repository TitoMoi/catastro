import { TestBed } from '@angular/core/testing';

import { CatastroCodigoService } from './catastro-codigo.service';

describe('CatastroCodigoService', () => {
  let service: CatastroCodigoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatastroCodigoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
