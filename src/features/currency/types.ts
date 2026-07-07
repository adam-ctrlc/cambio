export type Rates = Record<string, number>;

export type Currencies = Record<string, string>;

export interface LatestRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Rates;
}

export interface HistoricalRatesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Rates>;
}
