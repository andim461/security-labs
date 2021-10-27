import { makeAutoObservable, action } from "mobx";
import { api } from "../api";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
  isActivated: boolean;
  isBlocked: boolean;
  isPasswordRestricted: boolean;
};

export class DataStore {
  currentUser: null | User = null;
  loginErrorMessage = "";

  usersData: null | User[] = null;

  constructor() {
    makeAutoObservable(this);
  }

  signIn(name: string, password: string) {
    api
      .signIn(name, password)
      .then(
        action((response) => {
          if (response.status === 200) {
            this.currentUser = response.data as User;
            this.loginErrorMessage = "";
          }
          this.getUsers();
        })
      )
      .catch(
        action((error) => {
          console.log(error.response);
          this.currentUser = null;
          if (error?.response?.data) {
            this.loginErrorMessage = error.response.data as string;
          }
        })
      );
  }

  signOut() {
    if (this.currentUser) {
      this.currentUser = null;
      this.usersData = null;
    }
  }

  getUsers() {
    api
      .getUsers()
      .then(
        action((response) => {
          console.log(response);
          if (response.status === 200) {
            this.usersData = response.data as User[];
          }
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }
}

const dataStore = new DataStore();
export { dataStore };
