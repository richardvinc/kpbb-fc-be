import { PlateNumber } from "@KPBBFC/car";
import { Mapper, StaticImplements, UniqueEntityId } from "@KPBBFC/core";

import { UserCar } from "../domains/UserCar";

export interface PostgresUserCarProps {
  id: string;
  user_id: string;
  car_brand_id: string;
  car_model_id: string;
  car_sub_model_id: string;

  plate_number: string;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<UserCar, PostgresUserCarProps>>()
export class PostgresUserCarMapper {
  public static toDomain(props: PostgresUserCarProps): UserCar {
    return UserCar.create(
      {
        userId: new UniqueEntityId(props.user_id),
        carBrandId: new UniqueEntityId(props.car_brand_id),
        carModelId: new UniqueEntityId(props.car_model_id),
        carSubModelId: new UniqueEntityId(props.car_sub_model_id),

        plateNumber: PlateNumber.create(props.plate_number),

        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id)
    );
  }

  public static toPersistence(domain: UserCar): PostgresUserCarProps {
    return {
      id: domain.id.toString(),
      user_id: domain.userId.toString(),
      car_brand_id: domain.carBrandId.toString(),
      car_model_id: domain.carModelId.toString(),
      car_sub_model_id: domain.carSubModelId.toString(),

      plate_number: domain.plateNumber.value.toString(),

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
