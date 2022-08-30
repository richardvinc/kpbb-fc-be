import { Mapper, StaticImplements, UniqueEntityId } from "@kopeka/core";

import { User, Username } from "../domains";

export interface PostgresUserProps {
  id: string;
  firebase_uid: string;
  username?: string;
  // phone_number?: string;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<User, PostgresUserProps>>()
export class PostgresUserMapper {
  public static toDomain(props: PostgresUserProps): User {
    return User.create(
      {
        firebaseUid: props.firebase_uid,
        username: props.username ? Username.create(props.username) : undefined,
        // phoneNumber: props.phone_number
        //   ? MobileNumber.create(props.phone_number)
        //   : undefined,

        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id)
    );
  }

  public static toPersistence(domain: User): PostgresUserProps {
    return {
      id: domain.id.toString(),
      firebase_uid: domain.firebaseUid,
      username: domain.username?.value.toString(),
      // phone_number: domain.phoneNumber?.toString(),

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
