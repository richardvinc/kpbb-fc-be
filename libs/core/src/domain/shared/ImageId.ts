import { Entity, UniqueEntityId } from "@KPBBFC/core/domain";

export class ImageId extends Entity<null> {
  private constructor(id?: UniqueEntityId) {
    super(null, id);
  }

  get value(): UniqueEntityId {
    return this._id;
  }

  public static create(id?: UniqueEntityId): ImageId {
    return new ImageId(id);
  }
}
