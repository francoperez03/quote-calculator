export interface IRateProvider {
  getQuote: ({
    pair,
    operation,
    amount,
  }: {
    pair: string;
    operation: string;
    amount: number;
  }) => any;
  getRate: ({ pair }: { pair: string }) => any;
}
