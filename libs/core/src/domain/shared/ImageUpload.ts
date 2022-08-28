import { object } from "joi";

import { Guard, InternalError } from "@kopeka/core";
import { AggregateRoot, UniqueEntityId } from "@kopeka/core/domain";
import { IFileInfo } from "@kopeka/types";

import { ImageId } from "./ImageId";

export interface ImageUploadProps {
  fileInfo: IFileInfo;
}

export class ImageUpload extends AggregateRoot<ImageUploadProps> {
  private static SCHEMA = object<ImageUploadProps>({
    fileInfo: object().required(),
  }).required();

  private constructor(props: ImageUploadProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): ImageId {
    return ImageId.create(this._id);
  }

  get fileInfo(): IFileInfo {
    return this.props.fileInfo;
  }

  public static create(
    props: ImageUploadProps,
    id?: UniqueEntityId
  ): ImageUpload {
    const guardResult = Guard.against<ImageUploadProps>(this.SCHEMA, props);
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("ImageUpload", guardResult.message);
    } else {
      props = guardResult.value;

      return new ImageUpload(
        {
          ...props,
        },
        id
      );
    }
  }
}
