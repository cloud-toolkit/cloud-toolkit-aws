interface Enum {
  [key: number]: string | number;
}

export class UnsupportedTypeError extends Error {
  constructor(currentType: string, supportedTypes: Enum) {
    const msg = `Unsupported value '${currentType}'. Supported values: '${Object.values(
      supportedTypes
    )}'`;
    super(msg);
    Object.setPrototypeOf(this, UnsupportedTypeError.prototype);
  }
}
