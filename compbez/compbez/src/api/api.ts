import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

const urls = {
  signInUrl: "/signIn",
  getUsersUrl: "/getUsers",
  addUserUrl: "/addUser",
  toggleBlockUserUrl: "/toggleBlockUser",
  activateUser: "/activateUser",
  changePassword: "/changePassword",
  toggleRestrictedPassword: "/toggleRestrictedPassword",
};

const signIn = (name: string, password: string) =>
  instance.post(urls.signInUrl, {
    name,
    password,
  });

const addUser = (userName: string) =>
  instance.post(urls.addUserUrl, {
    name: userName,
  });

const toggleBlockUser = (id: string) =>
  instance.post(urls.toggleBlockUserUrl, {
    id,
  });

const activateUser = (userId: string, newPassword: string) =>
  instance.post(urls.activateUser, {
    id: userId,
    newPassword,
  });

const changePassword = (
  userId: string,
  oldPassword: string,
  newPassword: string
) =>
  instance.post(urls.changePassword, {
    id: userId,
    oldPassword,
    newPassword,
  });

const toggleRestrictedUser = (id: string) =>
  instance.post(urls.toggleRestrictedPassword, {
    id,
  });

const getUsers = () => instance.get(urls.getUsersUrl);

export {
  signIn,
  getUsers,
  addUser,
  toggleBlockUser,
  activateUser,
  changePassword,
  toggleRestrictedUser,
};
