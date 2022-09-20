import { Mapper, StaticImplements, UniqueEntityId } from "@KPBBFC/core";

import { CarBrand, CarModel } from "../domains";

export interface PostgresCarModelProps {
  id: string;
  brand?: CarBrand;
  car_brand_id: string;

  name: string;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<CarModel, PostgresCarModelProps>>()
export class PostgresCarModelMapper {
  public static toDomain(props: PostgresCarModelProps): CarModel {
    return CarModel.create(
      {
        carBrandId: new UniqueEntityId(props.car_brand_id),
        brand: props.brand,
        name: props.name,

        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id)
    );
  }

  public static toPersistence(domain: CarModel): PostgresCarModelProps {
    return {
      id: domain.id.toString(),
      car_brand_id: domain.carBrandId.toString(),
      name: domain.name,

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
