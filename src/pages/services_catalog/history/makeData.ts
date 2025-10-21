export class Service {
  serviceNumber: string | undefined;
  serviceName: string | undefined;
  description: string | undefined;
  companyName: string | undefined;
  departmentName: string | undefined;
  fio: string | undefined;
  curator: string | undefined;
  manager: string | undefined;
  status: string | undefined;
  reason: string | undefined;
  dateStart: string | undefined;
  scale: string | undefined;
  influence: string | undefined;
  additionalInformation: string | undefined;
}

export const data: Service[] = [

  {
    'serviceNumber': '084014',
    'serviceName': 'Услуга технической поддержки прикладного ПО пользователей',
    'description': 'Установка, настройка и поддер...',
    'companyName': 'АО "Алтайэнергосбыт"',
    'departmentName': 'Руководство',
    'fio': 'Гусев Алексей Сергеевич',
    'curator': 'Гусев Алексей Сергеевич',
    'manager': 'Гусев Алексей Сергеевич',
    'status': 'Промышленная эксплуатация (ПЭ)',
    'reason': 'Приказ №103 от 08.07.2009',
    'dateStart': '',
    'scale': 'Локальный',
    'influence': 'Средний',
    'additionalInformation': '',
  },
  {
    'serviceNumber': '084100',
    'serviceName': 'Услуга предоставления доступа к ПК РУ ЖКХ',
    'description': 'Для организации расчета услуг...',
    'companyName': 'АО "Алтайэнергосбыт"',
    'departmentName': 'Руководство',
    'fio': 'Батюк Алексей Сергеевич',
    'curator': 'Мелихова Марина Вячеславовна',
    'manager': 'Мелихова Марина Вячеславовна',
    'status': 'Промышленная эксплуатация (ПЭ)',
    'reason': 'Приказ от 23.07.2021 № АЭС/524',
    'dateStart': '23.07.2021',
    'scale': 'Локальный',
    'influence': 'Средний',
    'additionalInformation': '',
  },
  {
    'serviceNumber': '084083',
    'serviceName': 'Услуга предоставления доступа к системе управления взаимодействием с клиентами для различных видов услуг (СУВК ЖКХ)',
    'description': 'Система служит для наполнения...',
    'companyName': 'АО "Алтайэнергосбыт"',
    'departmentName': 'Руководство',
    'fio': 'Гусев Алексей Сергеевич',
    'curator': 'Гусев Алексей Сергеевич',
    'manager': 'Мелихова Марина Вячеславовна',
    'status': 'Промышленная эксплуатация (ПЭ)',
    'reason': 'Проект «Внедрение и настройка СУВК для АО «Алтайэнергосбыт» Группы «Интер РАО» Большой Форсаж»',
    'dateStart': '03.02.2020',
    'scale': 'Корпоративный',
    'influence': 'Средний',
    'additionalInformation': 'Система управления взаимодействием с клиентами для различных видов услуг (СУВК ЖКХ).',
  }
  ]
