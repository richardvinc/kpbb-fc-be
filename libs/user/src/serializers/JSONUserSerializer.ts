import { Serializer, StaticImplements } from "@kopeka/core";

import { User } from "../domains";

export interface JSONUserProps {
  id: string;

  firebaseUid: string;
  username?: string;

  createdAt?: string;
  updatedAt?: string;
}

@StaticImplements<Serializer<User, JSONUserProps>>()
export class JSONUserSerializer {
  public static deserialize(): User {
    throw new Error("Method not implemented.");
  }

  public static serialize(domain: User): JSONUserProps {
    return {
      id: domain.id.toString(),

      firebaseUid: domain.firebaseUid,
      username: domain.username?.value.toString(),

      createdAt: domain.createdAt?.toISOString(),
      updatedAt: domain.updatedAt?.toISOString(),
    };
  }
}
