import { Mapper, StaticImplements, UniqueEntityId } from "@KPBBFC/core";

import { UserFuelConsumptionSummary } from "../domains/UserFuelConsumptionSummary";

export interface PostgresUserFuelConsumptionSummaryProps {
  user_id: string;
  user_car_id: string;

  car_brand_id: string;
  car_model_id: string;
  car_sub_model_id: string;

  total_km_travelled: number;
  total_fuel_filled: number;
  average: number;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

@StaticImplements<
  Mapper<UserFuelConsumptionSummary, PostgresUserFuelConsumptionSummaryProps>
>()
export class PostgresUserFuelConsumptionSummaryMapper {
  public static toDomain(
    props: PostgresUserFuelConsumptionSummaryProps
  ): UserFuelConsumptionSummary {
    return UserFuelConsumptionSummary.create({
      userId: new UniqueEntityId(props.user_id),
      userCarId: new UniqueEntityId(props.user_car_id),

      carBrandId: new UniqueEntityId(props.car_brand_id),
      carModelId: new UniqueEntityId(props.car_model_id),
      carSubModelId: new UniqueEntityId(props.car_sub_model_id),

      totalKmTravelled: props.total_km_travelled,
      totalFuelFilled: props.total_fuel_filled,
      average: props.average,

      createdAt: props.created_at,
      updatedAt: props.updated_at,
      deletedAt: props.deleted_at,
    });
  }

  public static toPersistence(
    domain: UserFuelConsumptionSummary
  ): PostgresUserFuelConsumptionSummaryProps {
    return {
      user_id: domain.userId.toString(),
      user_car_id: domain.userCarId.toString(),

      car_brand_id: domain.carBrandId.toString(),
      car_model_id: domain.carModelId.toString(),
      car_sub_model_id: domain.carSubModelId.toString(),

      total_km_travelled: domain.totalKmTravelled,
      total_fuel_filled: domain.totalFuelFilled,
      average: domain.average,

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
