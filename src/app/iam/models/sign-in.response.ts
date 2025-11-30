export class SignInResponse {
  public id: number;
  public username: string;
  public token: string;
  public role?: string; // Optional, will be fetched from account if not present

  /**
   * Constructor for SignInResponse
   * @param id The account id
   * @param username The username
   * @param token The generated token
   * @param role Optional role (fetched separately if not provided)
   */
  constructor(id: number, username: string, token: string, role?: string) {
    this.id = id;
    this.username = username;
    this.token = token;
    this.role = role;
  }
}
