import { Mapper, StaticImplements, UniqueEntityId } from "@KPBBFC/core";

import { AccumulatedFuelConsumption } from "../domains/AccumulatedFuelConsumption";

export interface PostgresAccumulatedFuelConsumptionProps {
  car_brand_id: string;
  car_model_id: string;
  car_sub_model_id: string;

  printed_name?: string;

  total_car: number;
  total_km_travelled: number;
  total_fuel_filled: number;
  average: number;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

@StaticImplements<
  Mapper<AccumulatedFuelConsumption, PostgresAccumulatedFuelConsumptionProps>
>()
export class PostgresAccumulatedFuelConsumptionMapper {
  public static toDomain(
    props: PostgresAccumulatedFuelConsumptionProps
  ): AccumulatedFuelConsumption {
    return AccumulatedFuelConsumption.create({
      carBrandId: new UniqueEntityId(props.car_brand_id),
      carModelId: new UniqueEntityId(props.car_model_id),
      carSubModelId: new UniqueEntityId(props.car_sub_model_id),

      printedName: props.printed_name,

      totalCar: Number(props.total_car),
      totalKmTravelled: Number(props.total_km_travelled),
      totalFuelFilled: Number(props.total_fuel_filled),
      average: Number(props.average),

      createdAt: props.created_at,
      updatedAt: props.updated_at,
      deletedAt: props.deleted_at,
    });
  }

  public static toPersistence(
    domain: AccumulatedFuelConsumption
  ): PostgresAccumulatedFuelConsumptionProps {
    return {
      car_brand_id: domain.carBrandId.toString(),
      car_model_id: domain.carModelId.toString(),
      car_sub_model_id: domain.carSubModelId.toString(),

      total_car: domain.totalCar,
      total_km_travelled: domain.totalKmTravelled,
      total_fuel_filled: domain.totalFuelFilled,
      average: domain.average,

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
