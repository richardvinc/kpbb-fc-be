import { Mapper, MobileNumber, StaticImplements, UniqueEntityId } from "@kopeka/core";

import { User, Username } from "../domains";

export interface PostgresUserProps {
  id: string;
  phone_number: string;
  username?: string;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<User, PostgresUserProps>>()
export class PostgresUserMapper {
  public static toDomain(props: PostgresUserProps): User {
    return User.create(
      {
        phoneNumber: MobileNumber.create(props.phone_number),
        username: props.username ? Username.create(props.username) : undefined,

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
      phone_number: domain.phoneNumber.toString(),
      username: domain.username?.toString(),

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
