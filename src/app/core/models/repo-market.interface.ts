export interface RepoMarketI {
  amountToBorrow: number;
  amountToLend: number;
  assetClass: string;
  borrowerRepoRate: number;
  convertedDailyValue: number;
  currency: string;
  dailyValue: number;
  dailyVolume: number;
  date: string;
  haircut: number;
  highRepoRate: number;
  id: number;
  lastRepoRate: number;
  lenderRepoRate: number;
  lowRepoRate: number;
  numberOfTrades: number;
  openRepoRate: number;
  previousCloseRepoRate: number;
  qtyToBorrow: number;
  qtyToLend: number;
  referencePrice: number;
  repoMarket: string;
  repoPeriod: number;
  repoPrice: number;
  repoRateChange: number;
  state: string;
}
