import { TestBed, inject } from '@angular/core/testing';

import { IoRpcService } from './io-rpc.service';

describe('IoRpcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IoRpcService]
    });
  });

  it('should be created', inject([IoRpcService], (service: IoRpcService) => {
    expect(service).toBeTruthy();
  }));
});
