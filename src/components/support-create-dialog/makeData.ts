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
        initiator: 'Петров П.П.',
        user: 'Иванов И.И.',
        itModule: undefined,
        service: undefined,
    },
        {
        requestNumber: '000004',
        dateRegistration: '03.11.24 8.30',
        dateDesired: '06.12.24 8.30',
        dateSolution: undefined,
        status: 'Закрыта',
        header: undefined,
        requestType: 'ЗНО',
        initiator: 'Сидоров С.С.',
        user: 'Кузнецов К.К.',
        itModule: undefined,
        service: undefined,
    },
        {
        requestNumber: '000009',
        dateRegistration: '06.06.25 8.30',
        dateDesired: '30.09.25 8.30',
        dateSolution: undefined,
        status: 'Новая',
        header: undefined,
        requestType: 'ЗНИ',
        initiator: 'Борисов Б.Б.',
        user: 'Федоров Ф.Ф.',
        itModule: undefined,
        service: undefined,
    },
            {
        requestNumber: '000001',
        dateRegistration: '26.10.25 8.30',
        dateDesired: '29.10.25 8.30',
        dateSolution: undefined,
        status: 'Новая',
        header: undefined,
        requestType: 'ЗНД',
        initiator: 'Алексеев А.А.',
        user: 'Семенов С.С.',
        itModule: undefined,
        service: undefined,
    },
            {
        requestNumber: '000003',
        dateRegistration: '09.09.25 8.30',
        dateDesired: '10.10.25 8.30',
        dateSolution: undefined,
        status: 'На согласовании',
        header: undefined,
        requestType: 'ЗНО',
        initiator: 'Григорьев Г.Г.',
        user: 'Васильев В.В.',
        itModule: undefined,
        service: undefined,
    },
]