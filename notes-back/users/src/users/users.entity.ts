export type ROLES = 'admin' | 'user'

export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public role: ROLES,
  ) {}
}
