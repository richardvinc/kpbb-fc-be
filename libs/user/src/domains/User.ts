import { date, object } from "joi";

import { AggregateRoot, UniqueEntityId } from "@kopeka/core/domain";
import { MobileNumber } from "@kopeka/core/domain/shared";
import { InternalError } from "@kopeka/core/errors";
import { Guard } from "@kopeka/core/logic";

import { Username } from "./Username";

interface UserProps {
  phoneNumber?: MobileNumber;
  username?: Username;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserDTO {
  id: string;
  phoneNumber?: string;
  username?: string;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export class User extends AggregateRoot<UserProps> {
  private static schema = object<UserProps>({
    phoneNumber: object().optional(),
    username: object().optional(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional(),
  }).required();

  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get username(): Username | undefined {
    return this.props.username;
  }

  get phoneNumber(): MobileNumber | undefined {
    return this.props.phoneNumber;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public static create(props: UserProps, id?: UniqueEntityId): User {
    const guardResult = Guard.against<UserProps>(this.schema, props);
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("User", guardResult.message);
    } else {
      return new User(
        {
          ...props,
        },
        id
      );
    }
  }
}
