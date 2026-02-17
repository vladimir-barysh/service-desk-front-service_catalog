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
  comment: string | undefined;
}

export class OrderType{
    idOrderType: number | undefined;
    name: string | undefined;
}
export class CatItem{
    idCatitem: number | undefined;
    name: string | undefined;
}
export interface Service {
  idService: number | undefined;
  fullname: string | undefined;
  sname: string | undefined;
  description: string | undefined;
  developer: string | undefined;
  dateS: Dayjs | undefined;
  dateF: Dayjs | undefined;
  priznakIs: boolean | undefined;
  serviceType: ServiceType | undefined;
  serviceState: ServiceState | undefined;
  expType: ExpType | undefined;
  serviceParent: Service | undefined;
  isNeedApproval: boolean | undefined;
  isService: boolean | undefined;
  businessCritical: number | undefined;
  basisS: string | undefined;
}

export interface ServiceType {
  idServiceType: number | undefined;
  name: string | undefined;
  fullname: string | undefined;
}

export interface ServiceState {
  idServiceState: number | undefined;
  name: string | undefined;
}

export interface ExpType {
  idExpType: number | undefined;
  name: string | undefined;
}
export class OrderState{
    idOrderState: number | undefined;
    name: string | undefined;
}
export class OrderPriority{
    idOrderPriority: number | undefined;
    name: string | undefined;
}
export class User{
    idItUser: number | undefined;
    emailAd: string | undefined;
    telAd: string | undefined;
    fio1c: string | undefined;
    podr: Podr | undefined;
    dolzh1c: string | undefined;
}
export class OrderSource{
    idOrderSource: number | undefined;
    name: string | undefined;
}
export class Request {
  requestNumber: string | undefined;
  dateRegistration: string | undefined;
  dateDesired: string | undefined;
  dateSolution: string | undefined;
  status: string | undefined;
  header: string | undefined;
  requestType: string | undefined;
  initiator: string | undefined;
  user: string | undefined;
  itModule: string | undefined;
  service: string | undefined;
  description: string | undefined;
}

export class Podr{
    idPodr: number | undefined;
    name: string | undefined;
}