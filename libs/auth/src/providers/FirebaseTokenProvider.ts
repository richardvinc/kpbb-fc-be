import { auth } from "firebase-admin";

import { BaseProvider } from "@KPBBFC/core/providers";

import { ITokenProvider } from "./ITokenProvider";

interface Cradle {
  firebaseAuthClient: auth.Auth;
}

export class FirebaseTokenProvider
  extends BaseProvider
  implements ITokenProvider
{
  private firebaseAuthClient: auth.Auth;
  constructor(cradle: Cradle) {
    super("FirebaseOTPProvider");

    this.firebaseAuthClient = cradle.firebaseAuthClient;
  }

  async verifyIdToken(idToken: string): Promise<string | undefined> {
    const decodedUser = await this.firebaseAuthClient.verifyIdToken(idToken);

    if (decodedUser) return decodedUser.uid;

    return undefined;
  }
}
