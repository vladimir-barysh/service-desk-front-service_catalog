import { useMemo } from 'react';
import { useOrderStates } from './useOrderState';
import { HourglassEmpty, Pending, CheckCircle, Cancel, Block, RemoveCircle } from '@mui/icons-material';

interface OrderStatesMap {
  statusMap: Record<number, { label: string; icon: JSX.Element; bgColor: string }>;
  idByName: Map<string, number>;
  inProgressId: number;
  approvedId: number;
  notApprovedId: number;
  rejectedId: number;
  canceledId: number;
}

const visualConfig: Record<string, { icon: JSX.Element; bgColor: string }> = {
  'В ожидании': { icon: <HourglassEmpty />, bgColor: '#FFF9C4' },
  'На согласовании': { icon: <Pending />, bgColor: '#ffe6bd' },
  'Согласовано': { icon: <CheckCircle />, bgColor: '#c7ffcd' },
  'Не согласовано': { icon: <Cancel />, bgColor: '#feaeae' },
  'Согласование отклонено': { icon: <Block />, bgColor: '#FFEBEE' },
  'Согласование отменено': { icon: <RemoveCircle />, bgColor: '#efefef' },
};

export const useOrderStatesMap = (): OrderStatesMap => {
  const { data: orderStates = [] } = useOrderStates();

  const statusMap = useMemo(() => {
    const map: Record<number, { label: string; icon: JSX.Element; bgColor: string }> = {};
    orderStates.forEach(state => {
      const visual = visualConfig[state.name];
      map[state.idOrderState] = {
        label: state.name,
        icon: visual?.icon || null,
        bgColor: visual?.bgColor || '#efefef',
      };
    });
    return map;
  }, [orderStates]);

  const idByName = useMemo(() => {
    const map = new Map<string, number>();
    orderStates.forEach(s => map.set(s.name, s.idOrderState));
    return map;
  }, [orderStates]);

  return {
    statusMap,
    idByName,
    inProgressId: idByName.get('На согласовании')!,
    approvedId: idByName.get('Согласовано')!,
    notApprovedId: idByName.get('Не согласовано')!,
    rejectedId: idByName.get('Согласование отклонено')!,
    canceledId: idByName.get('Согласование отменено')!,
  };
};