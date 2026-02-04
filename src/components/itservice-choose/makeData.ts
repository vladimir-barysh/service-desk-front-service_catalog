import { Dayjs } from "dayjs";

// Тип записи каталога
export enum ItSystemStatus {
  Active = "active",
  Inactive = "inactive",
  Archived = "archived",
}

export interface ItSystem {
  id: string;
  name: string;     // наименование
  status: ItSystemStatus;
}

// Мок-данные каталога (пример)
export const systems: ItSystem[] = [
  { id: '1c',   name: '1С:Предприятие',         status: ItSystemStatus.Active },
  { id: 'lk',   name: 'Личный кабинет',         status: ItSystemStatus.Archived },
  { id: 'bill', name: 'Биллинговые системы',    status: ItSystemStatus.Active },
  { id: 'orm',  name: 'ОРЭМ',                   status: ItSystemStatus.Active },
  { id: 'tech', name: 'Технические ИТ сервисы', status: ItSystemStatus.Active },
  { id: 'old',  name: 'Старый CRM',             status: ItSystemStatus.Inactive },
  { id: '1c',   name: '1С:Предприятие',         status: ItSystemStatus.Active },
  { id: 'lk',   name: 'Личный кабинет',         status: ItSystemStatus.Archived },
  { id: 'bill', name: 'Биллинговые системы',    status: ItSystemStatus.Active },
  { id: 'orm',  name: 'ОРЭМ',                   status: ItSystemStatus.Active },
  { id: 'tech', name: 'Технические ИТ сервисы', status: ItSystemStatus.Active },
  { id: 'old',  name: 'Старый CRM',             status: ItSystemStatus.Inactive },
];

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
export interface ExpType {
  idExpType: number | undefined;
  name: string | undefined;
}