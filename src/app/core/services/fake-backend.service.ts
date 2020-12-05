import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/modules/user/user-model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FakeBackendService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  signup(user: UserModel) {
    return this.http.post('/users/register', user);
  }

  login(email: string, password: string) {
    return this.http.post('/users/authenticate', {email: email, password: password}).pipe(
      map(user => {
        if (user) {
          this.storageService.saveCurrentUser(user as UserModel);
        }
        return user;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    this.storageService.deleteCurrentUser();
  }
}
