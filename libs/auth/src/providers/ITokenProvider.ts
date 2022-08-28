export interface ITokenProvider {
  verifyIdToken(idToken: string): Promise<string | undefined>;
}
