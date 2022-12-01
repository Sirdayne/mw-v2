export interface EtfInterface {
  assetClass: string;
  averageWeightedPrice: number;
  bidPrice: number;
  bidQty: number;
  changedCurrency: string;
  currency: string;
  highPrice: number;
  icp: number;
  iop: number;
  isEnableMultiCurrency: boolean;
  lastTrade: number;
  lowPrice: number;
  marketState: string;
  nav: string;
  navCurrency: string;
  navFileId: string;
  navFileName: string;
  numberOfTrades: number;
  offerPrice: number;
  offerQty: number;
  open: number;
  percentChange: number;
  previousClose: number;
  priceChange: number;
  secCode: string;
  shortName: string;
  state: string;
  value: number;
}
