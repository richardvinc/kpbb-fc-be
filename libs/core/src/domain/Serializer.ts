export abstract class Serializer<TDomain, TSerialized> {
  public abstract deserialize(raw: TSerialized): TDomain;
  public abstract serialize(domain: TDomain): TSerialized;
}
