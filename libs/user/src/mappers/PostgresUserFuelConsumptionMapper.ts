import { Mapper, StaticImplements, UniqueEntityId } from "@KPBBFC/core";

import { UserFuelConsumption } from "../domains/UserFuelConsumption";

export interface PostgresUserFuelConsumptionProps {
  id: string;
  user_id: string;
  user_car_id: string;
  km_traveled: number;
  fuel_filled: number;
  average: number;

  filled_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

@StaticImplements<
  Mapper<UserFuelConsumption, PostgresUserFuelConsumptionProps>
>()
export class PostgresUserFuelConsumptionMapper {
  public static toDomain(
    props: PostgresUserFuelConsumptionProps
  ): UserFuelConsumption {
    return UserFuelConsumption.create(
      {
        userId: new UniqueEntityId(props.user_id),
        userCarId: new UniqueEntityId(props.user_car_id),
        kmTravelled: props.km_traveled,
        fuelFilled: props.fuel_filled,
        average: props.average,

        filledAt: props.filled_at,
        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id)
    );
  }

  public static toPersistence(
    domain: UserFuelConsumption
  ): PostgresUserFuelConsumptionProps {
    return {
      id: domain.id.toString(),
      user_id: domain.userId.toString(),
      user_car_id: domain.userCarId.toString(),

      km_traveled: domain.kmTravelled,
      fuel_filled: domain.fuelFilled,
      average: domain.average,

      filled_at: domain.filledAt,
      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
