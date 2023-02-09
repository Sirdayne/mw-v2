export interface ChartPoint {
  price: number;
  rowIdentificationNumber: number;
  value: number
  x: string;
}

export interface ChartNav {
  dateAt: string;
  nav: number;
}
