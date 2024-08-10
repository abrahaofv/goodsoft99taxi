export interface CupomDesconto {
  trace_Id: string;
  statusCode: number;
  errmsg: string;
  cupomvalido : boolean;
  data : CupomData;
}

export interface CupomData {
  uuid: string;
  orderId: string;
  totalDiscountedOrderAmount: number;
  totalDiscount: number;
  orderItems: OrderItem[];
}

export interface OrderItem {
  uuid: string;
  productCode: string;
  discountAmount: number;
}