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
}

// Данные для примера
export const data: Request[] = [
    {
        requestNumber: '000011',
        dateRegistration: '06.11.24 8.30',
        dateDesired: undefined,
        dateSolution: undefined,
        status: 'На контроле',
        header: undefined,
        requestType: undefined,
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
    },
        {
        requestNumber: '000004',
        dateRegistration: '03.11.24 8.30',
        dateDesired: '04.11.24 8.30',
        dateSolution: undefined,
        status: 'В работе',
        header: undefined,
        requestType: 'ЗНО',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
    },
        {
        requestNumber: '000008',
        dateRegistration: '06.12.24 8.30',
        dateDesired: undefined,
        dateSolution: undefined,
        status: 'В работе',
        header: undefined,
        requestType: 'ЗНИ',
        initiator: undefined,
        user: undefined,
        itModule: undefined,
        service: undefined,
    },
]