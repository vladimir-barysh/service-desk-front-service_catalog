import { Dayjs } from "dayjs";

export class Order {
  idOrder: number | undefined;
  nomer: string | undefined;
  name: string | undefined;
  description: string | undefined;
  dateCreated: Dayjs | undefined;
  dateFinishPlan: Dayjs | undefined;
  dateFinishFact: Dayjs | undefined;
  datePostpone: Dayjs | undefined;
  dateTechReturn: Dayjs | undefined;
  orderParentId: number | undefined;
  orderTypeId: number | undefined;
  orderTypeName: string | undefined;
  catalogItemId: number | undefined;
  catalogItemName: string | undefined;
  serviceId: number | undefined;
  serviceFullname: string | undefined;
  orderStateId: number | undefined;
  orderStateName: string | undefined;
  orderPriorityId: number | undefined;
  orderPriorityName: string | undefined;
  creatorId: number | undefined;
  initiatorId: number | undefined;
  dispatcherId: number | undefined;
  dispatcherFio: string | undefined;
  executorId: number | undefined;
  executorFio: string | undefined;
  orderSourceId: number | undefined;
  orderSourceName: string | undefined;
  resultText: string | undefined;
  comment: string | undefined;
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
