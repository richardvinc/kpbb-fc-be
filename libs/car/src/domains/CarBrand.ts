import { date, object, string } from "joi";

import { AggregateRoot, UniqueEntityId } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

interface CarBrandProps {
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class CarBrand extends AggregateRoot<CarBrandProps> {
  private static schema = object<CarBrandProps>({
    name: string().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(props: CarBrandProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get name(): string {
    return this.props.name;
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

  public static create(props: CarBrandProps, id?: UniqueEntityId): CarBrand {
    const guardResult = Guard.against<CarBrandProps>(this.schema, props);
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("CarBrand", guardResult.message);
    } else {
      return new CarBrand(
        {
          ...props,
          createdAt: props.createdAt || new Date(),
          updatedAt: props.updatedAt || new Date(),
        },
        id
      );
    }
  }
}
