import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpCounterService {
  pendingRequestsCount: number;
  constructor() {
    this.pendingRequestsCount = 0;
  }
}
