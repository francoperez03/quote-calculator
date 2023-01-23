export interface IRateProvider {
  getOrderBook({
    pair,
    operation,
  }: {
    pair: string;
    operation: string;
  }): Array<any>;
  getRate: ({ pair }: { pair: string }) => any;
}
