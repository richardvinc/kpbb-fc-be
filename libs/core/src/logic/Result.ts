export type Either<L, A> = Left<L, never> | Right<never, A>;

export class Left<L, A> {
  readonly error: L;

  constructor(value: L) {
    this.error = value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }
}

export const left = <L>(l: L): Either<L, never> => {
  return new Left(l);
};

export const right = <A>(a: A): Either<never, A> => {
  return new Right<never, A>(a);
};
