import { Dayjs } from "dayjs";

export class Order {
  idOrder: number | undefined;
  nomer: string | undefined;
  name: string | undefined;
  description: string | undefined;
  dateCreated: Dayjs | undefined;
  dateFinishPlan: Dayjs | undefined;
  dateFinishFact: Dayjs | undefined;
  orderParent: Order | undefined;
  orderType: OrderType | undefined;
  catalogItem: CatItem | undefined;
  service: Service | undefined;
  orderState: OrderState | undefined;
  orderPriority: OrderPriority | undefined;
  creator: User | undefined;
  initiator: User | undefined;
  dispatcher: User | undefined;
  executor: User | undefined;
  orderSource: OrderSource | undefined;
  resultText: string | undefined;
}

export class OrderType {
  idOrderType: number | undefined;
  name: string | undefined;
}
export class CatItem {
  idCatitem: number | undefined;
  name: string | undefined;
}
export class Service {
  idService: number | undefined;
  fullname: string | undefined;
}
export class OrderState {
  idOrderState: number | undefined;
  name: string | undefined;
}
export class OrderPriority {
  idOrderPriority: number | undefined;
  name: string | undefined;
}
export class User {
  idItUser: number | undefined;
  fio1c: string | undefined;
}
export class OrderSource {
  idOrderSource: number | undefined;
  name: string | undefined;
}
