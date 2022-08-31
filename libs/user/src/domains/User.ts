import { date, object, string } from "joi";

import { AggregateRoot, UniqueEntityId } from "@KPBBFC/core/domain";
import { MobileNumber } from "@KPBBFC/core/domain/shared";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

import { Username } from "./Username";

interface UserProps {
  firebaseUid: string;
  phoneNumber?: MobileNumber;
  username?: Username;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserDTO {
  id: string;
  firebaseUid: string;
  phoneNumber?: string;
  username?: string;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export class User extends AggregateRoot<UserProps> {
  private static schema = object<UserProps>({
    firebaseUid: string().required(),
    phoneNumber: object().optional(),
    username: object().optional(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get firebaseUid(): string {
    return this.props.firebaseUid;
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
