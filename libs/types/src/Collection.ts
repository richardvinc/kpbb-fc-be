export interface Collection<T> {
  data: T[];
}

export interface CollectionWithCursor<T> extends Collection<T> {
  cursor: {
    prevRecord?: T;
    nextRecord?: T;
  };
}
