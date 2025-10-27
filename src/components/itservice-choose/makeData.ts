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
];
