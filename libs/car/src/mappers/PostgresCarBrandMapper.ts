import { Mapper, StaticImplements, UniqueEntityId } from "@KPBBFC/core";

import { CarBrand } from "../domains";

export interface PostgresCarBrandProps {
  id: string;
  name: string;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<CarBrand, PostgresCarBrandProps>>()
export class PostgresCarBrandMapper {
  public static toDomain(props: PostgresCarBrandProps): CarBrand {
    return CarBrand.create(
      {
        name: props.name,

        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id)
    );
  }

  public static toPersistence(domain: CarBrand): PostgresCarBrandProps {
    return {
      id: domain.id.toString(),

      name: domain.name,

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
