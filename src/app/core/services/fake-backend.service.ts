import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/modules/user/user-model';

@Injectable({
  providedIn: 'root'
})
export class FakeBackendService {

  constructor(
    private http: HttpClient
  ) { }

  register(user: UserModel) {
    return this.http.post(`/users/register`, user);
}
}
