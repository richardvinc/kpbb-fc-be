export class WatchedProps<T> {
  private current: T;
  private initial: T;

  constructor(initial: T) {
    this.initial = initial;
    this.current = initial;
  }

  setCurrentProps(value: T): void {
    this.current = value;
  }

  getCurrentProps(): T {
    return this.current;
  }

  getInitialProps(): T {
    return this.initial;
  }

  isDirty(): boolean {
    return this.initial !== this.current;
  }
}
