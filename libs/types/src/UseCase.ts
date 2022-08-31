import { User } from "@KPBBFC/user";

export interface IUseCase<IDTO extends object, IResponse> {
  execute(command: ICommand<IDTO>): Promise<IResponse>;
}

export type ICommand<T extends object> = {
  dto: T;
};

export type ICommandWithIdentity<
  TDTO extends object,
  TIdentity extends object
> = ICommand<TDTO> & {
  identity: TIdentity;
};

export interface ICommandIdentity {
  id: string;
}

export interface ICommandVerifiedIdentity extends ICommandIdentity {
  user: User;
}
