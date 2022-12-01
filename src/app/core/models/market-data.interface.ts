export interface MarketDataI {
  assetClass: string
  averageWeightedPrice: number;
  bidPrice: number;
  bidQty: number;
  changedCurrency: string
  currency: string
  highPrice: number;
  icp: number;
  iop: number;
  isEnableMultiCurrency: number;
  lastTrade: number;
  lowPrice: number;
  numberOfTrades: number;
  offerPrice: number;
  offerQty: number;
  open: number;
  percentChange: number;
  previousClose: number;
  priceChange: number;
  secCode: string
  shortName: string
  state: string
  value: number;
  volume: number;
}
