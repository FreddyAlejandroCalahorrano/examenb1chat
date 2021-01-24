import { TestBed } from '@angular/core/testing';
import { firebaseservice } from './firebase.service';

describe('firebaseservice ', () => {
    let service: firebaseservice;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(firebaseservice);
    });
    it('Creado', () => {
        expect(service).toBeTruthy();
    });
})