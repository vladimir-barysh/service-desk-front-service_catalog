export class Request {
  nomer: string | undefined;
  name: string | undefined;
  description: string | undefined;
  dateCreated: string | undefined;
  dateFinishPlan: string | undefined;
  dateFinishFact: string | undefined;
  orderParent: Request | undefined;
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

export class OrderType{
    name: string | undefined;
}

export class CatItem{
    name: string | undefined;
}
export class Service{
    fullname: string | undefined;
}
export class OrderState{
    name: string | undefined;
}
export class OrderPriority{
    name: string | undefined;
}
export class User{
    fio1c: string | undefined;
}
export class OrderSource{
    name: string | undefined;
}
/*/ Данные для примера
export const data: order[] = [
    {
        nomer: '000011',
        dateCreated: '06.11.24 8.30',
        dateFinishPlan: '10.12.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Новая',
        name: 'Очень большой такой заголовок заявки',
        orderType: 'ЗНД',
        initiator: 'Христорождественская В.А.',
        creator: 'Христорождественская В.А.',
        catalogItem: '1C:Автотранспорт',
        service: 'Предоставить доступ на очень длинное название услуги',
        description: 'Длинное описание Длинное описание Длинное описание Длинное описание'
    },
        {
        nomer: '000004',
        dateCreated: '03.11.24 8.30',
        dateFinishPlan: '06.12.24 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'В работе',
        name: undefined,
        orderType: 'ЗНО',
        initiator: 'Христорождественская В.А.',
        creator: 'Христорождественская В.А.',
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
        {
        nomer: '000009',
        dateCreated: '06.06.25 8.30',
        dateFinishPlan: '30.09.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'На подтверждении',
        name: undefined,
        orderType: 'ЗНИ',
        initiator: undefined,
        creator: 'Христорождественская В.А.',
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
        {
        nomer: '000001',
        dateCreated: '26.10.25 8.30',
        dateFinishPlan: '29.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Возобновлена',
        name: undefined,
        orderType: 'ЗНД',
        initiator: undefined,
        creator: 'Христорождественская В.А.',
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
        {
        nomer: '000003',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Закрыта',
        name: undefined,
        orderType: 'ЗНО',
        initiator: 'Христорождественская В.А.',
        creator: 'Христорождественская В.А.',
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000005',
        dateCreated: '09.01.25 1.30',
        dateFinishPlan: '11.10.25 3.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'На согласовании',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: 'Христорождественская В.А.',
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000006',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Согласовано',
        name: undefined,
        orderType: 'ЗНО',
        initiator: 'Христорождественская В.А.',
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000007',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Не согласовано',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000008',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Согласование отклонено',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000010',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Согласование отменено',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000012',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'В ожидании',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000013',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Отклонена',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000014',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Отменена инициатором',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000015',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'На рассмотрении',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000016',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'На утверждении',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000017',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'Утверждено',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
    {
        nomer: '000018',
        dateCreated: '09.09.25 8.30',
        dateFinishPlan: '10.10.25 8.30',
        dateFinishFact: '10.12.25 8.30',
        OrderState: 'На контроле',
        name: undefined,
        orderType: 'ЗНО',
        initiator: undefined,
        creator: undefined,
        catalogItem: undefined,
        service: undefined,
        description: ''
    },
]*/