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
export class Service {
  serviceNumber: string | undefined;
  serviceName: string | undefined;
  description: string | undefined;
  startPurpose: string | undefined;
  dateStart: string | undefined;
  endPurpose: string | undefined;
  dateEnd: string | undefined;
  status: string | undefined;
  scale: string | undefined;
  influence: string | undefined;
  additionalInformation: string | undefined;
  subRows: Service[] | undefined;
}

export const data: Service[] = [
  {
    'serviceNumber': '084070',
    'serviceName': 'Услуга предоставления доступа к системе удаленного обзора показаний РМС-2150',
    'description': '',
    'startPurpose': 'Акт приемки в промышленную эксплуатацию ПО от 14.04.2017',
    'dateStart': '14.04.2017',
    'endPurpose': '',
    'dateEnd': '',
    'status': 'ПЭ',
    'scale': 'Локальный',
    'influence': 'Среднее',
    'additionalInformation': '',
    subRows: [],
  },


      {
        'serviceNumber': '084003',
        'serviceName': 'Услуга доступа к этажной печати документов',
        'description': '',
        'startPurpose': '',
        'dateStart': '',
        'endPurpose': '',
        'dateEnd': '',
        'status': 'ПЭ',
        'scale': 'Локальный',
        'influence': 'Среднее',
        'additionalInformation': '',
        subRows: [],
      },
      {
        'serviceNumber': '084004',
        'serviceName': 'Услуга доступа к конвертованию платёжных документов абонентам физическим лицам',
        'description': '',
        'startPurpose': '',
        'dateStart': '',
        'endPurpose': '',
        'dateEnd': '',
        'status': 'ПЭ',
        'scale': 'Локальный',
        'influence': 'Критичное',
        'additionalInformation': '',
        subRows: [],
      },
      {
        'serviceNumber': '084005',
        'serviceName': 'Услуга оргнаизации печати и сканирования документов',
        'description': '',
        'startPurpose': '',
        'dateStart': '',
        'endPurpose': '',
        'dateEnd': '',
        'status': 'ПЭ',
        'scale': 'Локальный',
        'influence': 'Среднее',
        'additionalInformation': '',
        subRows: [],
      },
  ]



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