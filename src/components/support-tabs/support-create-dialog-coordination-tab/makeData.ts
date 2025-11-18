import { Request } from '../../../pages/support/all-support/makeData';

export interface Coordination {
  id: number;
  sequenceNumber: number;
  approver: string;
  creationDate: string;
  deadline: string;
  completedDate: string;
  comment: string;
  status: 'Ожидание' | 'Согласовано' | 'Не согласовано';
}

// Функция для генерации данных согласования по типу заявки
export const generateCoordinationData = (request: Request | null): Coordination[] => {
  if (!request) return [];

  const baseData: Coordination = {
    id: 1,
    sequenceNumber: 1,
    approver: '',
    creationDate: '',
    deadline: '24 рабочих часа (1 итерация)',
    completedDate: 'дата нажатия на кнопку "Согласовано" / "Не согласовано"',
    comment: '',
    status: 'Согласовано'
  };

  switch (request.requestType) {
    case 'ЗНД':
      return [{
        ...baseData,
        approver: 'определяется по держателю сервиса из Каталога ИТ-услуг',
        creationDate: 'если процесс запускается автоматом то = дате регистрации заявки, если процесс запускает сотрудник 1 линии, то = дате запуска процесса',
        comment: 'Комментарий согласующего который он указал при нажатии на кнопку "Согласовано" / "Не согласовано"'
      }];
    
    case 'ЗНО':
    case 'инцидент':
      return [{
        ...baseData,
        approver: 'добавляет сотрудник 1 линии',
        creationDate: '-',
        comment: '-'
      }];
    
    case 'ЗНИ':
      return [{
        ...baseData,
        approver: 'добавляет сотрудник 1 линии', 
        creationDate: '-',
        comment: '-'
      }];
    
    default:
      return [{
        ...baseData,
        approver: 'не определен',
        creationDate: '-',
        comment: '-'
      }];
  }
};