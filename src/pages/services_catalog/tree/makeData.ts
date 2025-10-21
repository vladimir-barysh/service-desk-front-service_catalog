export class SubService {
  serviceType: string | undefined;
  serviceName: string | undefined;
  serviceShortName: string | undefined;
  parent: string | undefined;
  description: string | undefined;
  startPurpose: string | undefined;
  developerName: string | undefined;
  dateStart: string | undefined;
  endPurpose: string | undefined;
  dateEnd: string | undefined;
  status: string | undefined;
  scale: string | undefined;
  influence: string | undefined;
  isIS: boolean | undefined;
  isHasCoordinate: boolean | undefined;
  isService: boolean | undefined;
  criticalValue: number | undefined;
  subRows: SubService[] | undefined;
}

export class Service {
  serviceNumber: string | undefined;
  serviceName: string | undefined;
  parent:  string | undefined;
  developerName: string | undefined;
  description: string | undefined;
  startPurpose: string | undefined;
  dateStart: string | undefined;
  endPurpose: string | undefined;
  dateEnd: string | undefined;
  status: string | undefined;
  scale: string | undefined;
  influence: string | undefined;
  additionalInformation: string | undefined;
  subRows: SubService[] | undefined;
}

export const data: Service[] = [

  {
    'serviceNumber': '084001',
    'serviceName': 'Предоставление доступа к ПК АСУСЭ Арбитраж',
    'parent': 'АСУСЭ',
    'description': '',
    'startPurpose': 'Приказ №103 от 08.07.2009',
    'developerName': '',
    'dateStart': '15.07.2009',
    'endPurpose': '',
    'dateEnd': '',
    'status': 'АЭ',
    'scale': 'Локальный',
    'influence': 'Слабое',
    'additionalInformation': 'Выведено в архивную эксплуатацию приказом №АЭС/131/1 от 01.04.2019',
    subRows: [
      {
        'serviceType': 'ПО',
        'serviceName': 'ПК АСУСЭ Арбитраж',
        'serviceShortName': 'ПК АСУСЭ Арбитраж',
        'parent': 'Биллинговые системы',
        'description': 'Информационная система для учета всех юридических документов на всех этапах судебного производства',
        'startPurpose': '',
        'developerName': 'ООО "АЛЬФА-ИНТЕГРАТОР-ИНФОЭНЕРГО"',
        'dateStart': '',
        'endPurpose': '',
        'dateEnd': '',
        'status': 'АЭ',
        'scale': '',
        'influence': '',
        'isIS': true,
        'isHasCoordinate': true,
        'isService': true,
        'criticalValue': 3,
        subRows:
          [
            {
              'serviceType': 'ППО',
              'serviceName': 'Подсистема «Арбитраж, исполнительное производство»',
              'serviceShortName': 'Подсистема «Арбитраж, исполнительное производство»',
              'parent': 'ПК АСУСЭ Арбитраж ',
              'description': 'Предназначена для организации документооборота при работе с клиентами. Подсистема обеспечивает требуемую организацию документооборота при работе по учету и регистрация судебных исков, претензий и судебных решений по ним к потребителям энергии, а так же, ведение базы данных судебных дел (с описанием методик определения размера обязательств потребителя и размера претензий к нему)',
              'startPurpose': '',
              'developerName': '',
              'dateStart': '',
              'endPurpose': '',
              'dateEnd': '',
              'status': 'АЭ',
              'scale': '',
              'influence': '',
              'isIS': false,
              'isHasCoordinate': false,
              'isService': false,
              'criticalValue': 3,
              subRows: [
                {
                  'serviceType': 'ППО',
                  'serviceName': 'Арбитраж',
                  'serviceShortName': 'Арбитраж',
                  'parent': 'Подсистема «Арбитраж, исполнительное производство»',
                  'description': 'Формирование исков по выбираемым из базы данных документам начислений \n' +
                    'Формирование исков с ручным вводом сумм претензий\n' +
                    'Расчет пени к иску по выбранным документам\n' +
                    'Автоматический расчет и предъявление абоненту госпошлины\n' +
                    'Учет и планирование судебных заседаний\n' +
                    'Работа с службой судебных приставов',
                  'startPurpose': '',
                  'developerName': '',
                  'dateStart': '',
                  'endPurpose': '',
                  'dateEnd': '',
                  'status': 'АЭ',
                  'scale': '',
                  'influence': '',
                  'isIS': false,
                  'isHasCoordinate': false,
                  'isService': false,
                  'criticalValue': 3,
                  subRows: []
                },
                {
                  'serviceType': 'ППО',
                  'serviceName': 'Расчет пени',
                  'serviceShortName': 'Расчет пени',
                  'parent': 'Подсистема «Арбитраж, исполнительное производство»',
                  'description': 'Массовый и индивидуальный расчет:\n' +
                    '- процентов за пользование чужими денежными средствами,\n' +
                    '- законных процентов,\n' +
                    '- пени по договору.\n' +
                    'Выставление счетов на неустойку\n' +
                    'Возможность расчета пени от предыдущего расчета, от предыдущего выставленного счета или за всю историю \n' +
                    'Возможность исключения из расчета уже оплаченных на текущий момент документов начислений\n' +
                    'Возможность расчета пени для уведомлений и при формировании исков',
                  'startPurpose': '',
                  'developerName': '',
                  'dateStart': '',
                  'endPurpose': '',
                  'dateEnd': '',
                  'status': 'АЭ',
                  'scale': '',
                  'influence': '',
                  'isIS': false,
                  'isHasCoordinate': false,
                  'isService': false,
                  'criticalValue': 3,
                  subRows: []
                },
                {
                  'serviceType': 'ППО',
                  'serviceName': 'Уведомления о задолженности',
                  'serviceShortName': 'Уведомления о задолженности',
                  'parent': 'Подсистема «Арбитраж, исполнительное производство»',
                  'description': 'Формирование списка задолжников для рассылки уведомлений\n' +
                    'Печать или рассылка по электронной почте сформированных по шаблону уведомлений для абонентов из списка задолжников\n' +
                    'Автоматический расчет пени для отражения в уведомлении',
                  'startPurpose': '',
                  'developerName': '',
                  'dateStart': '',
                  'endPurpose': '',
                  'dateEnd': '',
                  'status': 'АЭ',
                  'scale': '',
                  'influence': '',
                  'isIS': false,
                  'isHasCoordinate': false,
                  'isService': false,
                  'criticalValue': 3,
                  subRows: []
                },
                {
                  'serviceType': 'ППО',
                  'serviceName': 'Претензии',
                  'serviceShortName': 'Претензии',
                  'parent': 'Подсистема «Арбитраж, исполнительное производство»',
                  'description': 'Формирование досудебных претензий по аналогичным (как для уведомлений) механизмам\n' +
                    'Создание папок и исков по списку претензий\n',
                  'startPurpose': '',
                  'developerName': '',
                  'dateStart': '',
                  'endPurpose': '',
                  'dateEnd': '',
                  'status': 'АЭ',
                  'scale': '',
                  'influence': '',
                  'isIS': false,
                  'isHasCoordinate': false,
                  'isService': false,
                  'criticalValue': 3,
                  subRows: []
                }
              ]
            }
          ]
      }
    ]
  }
  ]

export class tableDataClass {
  mainName: string | undefined;
  id: number | undefined;
}

export class rolesTableDataClass {
  department: string | undefined;
  role: string | undefined;
  roleName: string | undefined;
  id: number | undefined;
}


export const rolesEdit: rolesTableDataClass[] = [

  {
    'department': 'АО "Алтайэнергосбыт"',
    'role': 'Куратор от ИТ',
    'roleName': 'Петров Александр Аркадьевич',
    'id': 1,
  },
  {
    'department': 'АО "Алтайэнергосбыт"',
    'role': 'Функциональный заказчик',
    'roleName': 'Гусев Алексей Сергеевич',
    'id': 2,
  },
  {
    'department': 'АО "Алтайэнергосбыт"',
    'role': 'Сервис-менеджер',
    'roleName': 'Тимошенко Николай Александрович',
    'id': 3,
  },

]


export const rolesCreate: rolesTableDataClass[] = [

  {
    'department': 'АО "Алтайэнергосбыт"',
    'role': 'Куратор от ИТ',
    'roleName': '',
    'id': 1,
  },
  {
    'department': 'АО "Алтайэнергосбыт"',
    'role': 'Функциональный заказчик',
    'roleName': '',
    'id': 2,
  },
  {
    'department': 'АО "Алтайэнергосбыт"',
    'role': 'Сервис-менеджер',
    'roleName': '',
    'id': 3,
  },

]


export const servicesChoose: tableDataClass[] = [];
export const servicesAll: tableDataClass[] = [


  {
    'mainName': 'Предоставление доступа',
    'id': 1,
  },
  {
    'mainName': 'Добавление в группу для отображения базы в списке',
    'id': 2,
  },
  {
    'mainName': 'Изменение квоты',
    'id': 3,
  },
]

export class worktypesTableDataClass {
  departmentName: string | undefined;
  typeName: string | undefined;
  groupName: string | undefined;
  note: string | undefined;
  id: number | undefined;
}

export const worktypes: worktypesTableDataClass[] = [

  {
    'departmentName': 'АО "Алтайэнергосбыт"',
    'typeName': 'Предоставление доступа',
    'groupName': '1С: Предприятие',
    'note': '',
    'id': 1,
  },
  {
    'departmentName': 'АО "Алтайэнергосбыт"',
    'typeName': 'Добавление в группу для отображения базы в списке',
    'groupName': 'Администратор',
    'note': '',
    'id': 2,
  },
]