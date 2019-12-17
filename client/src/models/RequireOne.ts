export type Optional<T, P extends keyof T> = Omit<T, P> & Partial<Pick<T, P>>;

export type RequireOne<T, P1 extends keyof T, P2 extends keyof T> =
  | Optional<T, P1>
  | Optional<T, P2>;
