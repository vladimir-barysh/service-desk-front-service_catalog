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

// Данные для примера
export const data: Request[] = [
    {
        requestNumber: '000011',
        dateRegistration: '06.11.24 8.30',
        dateDesired: '10.12.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Новая',
        header: 'Очень большой такой заголовок заявки',
        requestType: 'ЗНД',
        initiator: 'Христорождественская В.А.',
        user: 'Христорождественская В.А.',
        itModule: '1C:Автотранспорт',
        service: 'Предоставить доступ на очень длинное название услуги',
        description: 'Длинное описание Длинное описание Длинное описание Длинное описание'
    },
        {
        requestNumber: '000004',
        dateRegistration: '03.11.24 8.30',
        dateDesired: '06.12.24 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'В работе',
        header: undefined,
        requestType: 'ЗНО',
        initiator: 'Христорождественская В.А.',
        user: 'Христорождественская В.А.',
        itModule: undefined,
        service: undefined,
        description: ''
    },
        {
        requestNumber: '000009',
        dateRegistration: '06.06.25 8.30',
        dateDesired: '30.09.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'На подтверждении',
        header: undefined,
        requestType: 'ЗНИ',
        initiator: undefined,
        user: 'Христорождественская В.А.',
        itModule: undefined,
        service: undefined,
        description: ''
    },
        {
        requestNumber: '000001',
        dateRegistration: '26.10.25 8.30',
        dateDesired: '29.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Возобновлена',
        header: undefined,
        requestType: 'ЗНД',
        initiator: undefined,
        user: 'Христорождественская В.А.',
        itModule: undefined,
        service: undefined,
        description: ''
    },
        {
        requestNumber: '000003',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Закрыта',
        header: undefined,
        requestType: 'ЗНО',
        initiator: 'Христорождественская В.А.',
        user: 'Христорождественская В.А.',
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000005',
        dateRegistration: '09.01.25 1.30',
        dateDesired: '11.10.25 3.30',
        dateSolution: '10.12.25 8.30',
        status: 'На согласовании',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: 'Христорождественская В.А.',
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000006',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Согласовано',
        header: undefined,
        requestType: 'ЗНО',
        initiator: 'Христорождественская В.А.',
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000007',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Не согласовано',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000008',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Согласование отклонено',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000010',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Согласование отменено',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000012',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'В ожидании',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000013',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Отклонена',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000014',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Отменена инициатором',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000015',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'На рассмотрении',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000016',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'На утверждении',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000017',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'Утверждено',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
    {
        requestNumber: '000018',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: '10.12.25 8.30',
        status: 'На контроле',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
        description: ''
    },
]