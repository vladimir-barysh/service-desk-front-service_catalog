import { Dayjs } from "dayjs";

export interface Article {
  idArticle: number | undefined;
  title: string | undefined;
  content: string | undefined;
  dateCreated: Dayjs | undefined;
  articleCategory: ArticleCategory | undefined;
  userCreator: User | undefined;
}

export interface ArticleCategory {
  idArticleCategory: number | undefined;
  name: string | undefined;
}

export interface Order {
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
  catalogItem: CatalogItem | undefined;
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

export interface OrderBinding {
  idOrderBinding: number;
  name: string;
  dC: string;
  idOrder: number;
  idUser: number;
}
export interface OrderType {
  idOrderType: number | undefined;
  name: string | undefined;
}
export interface CatalogItem {
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
export interface OrderState {
  idOrderState: number | undefined;
  name: string | undefined;
}
export interface OrderPriority {
  idOrderPriority: number | undefined;
  name: string | undefined;
}
export interface User {
  idItUser: number | undefined;
  emailAd: string | undefined;
  telAd: string | undefined;
  fio1c: string | undefined;
  podr: Podr | undefined;
  dolzh1c: string | undefined;
}
export interface OrderSource {
  idOrderSource: number | undefined;
  name: string | undefined;
}

export interface Podr {
  idPodr: number | undefined;
  name: string | undefined;
}

export interface OrderTask { 
  idOrderTask: number | undefined;
  order: Order | undefined;
  orderTaskParent: OrderTask | undefined;
  work: Work | undefined;
  executor: User | undefined;
  dateFinishPlan: Dayjs | undefined;
  dateFinishFact: Dayjs | undefined;
  description: string | undefined;
  closeParentCheck: boolean | undefined;
  taskState: TaskState | undefined;
  dateCrated: Dayjs | undefined;
  resultText: string | undefined;
}

export interface TaskState {
  idTaskState: number | undefined;
  name: string | undefined;
}

export interface Work {
  idWork: number | undefined;
  workParent: number | undefined;
  catitem: CatalogItem | undefined;
  service: Service | undefined;
  group: Group | undefined;
  workType: WorkType | undefined;
  remark: string | undefined;
  podr: Podr | undefined;
}

export interface WorkType {
  idWorkType: number | undefined;
  name: string | undefined;
  description: string | undefined;
}
// TODO: дописать
export interface Group {
  idGroup: number | undefined;
  name: string | undefined;
}