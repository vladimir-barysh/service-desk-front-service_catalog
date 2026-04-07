import { Dayjs } from "dayjs";
import { Order, OrderTask, Work, User, TaskState } from "./models";
export interface ArticleCreateDTO {
  title?: string;
  content?: string;
  idArticleCategory?: number;
  dateCreated?: string;
}

export interface ArticleUpdateDTO {
  title?: string;
  content?: string;
  idArticleCategory?: number;
}
  
  export interface OrderCreateDTO {
  name?: string;
  description?: string;
  dateFinishPlan?: string;
  idService?: number;
  idOrderType: number;
  resultText?: string;
  comment?: string;
}

export interface OrderUpdateDTO {
  name?: string;
  description?: string;
  dateFinishPlan?: string;
  dateFinishFact?: string;
  datePostpone?: string;
  idService?: number;
  idOrderType?: number;
  idOrderState?: number;
  idOrderPriority?: number;
  resultText?: string;
  comment?: string;
}

export interface OrderBindingDTO {
  idOrderBinding: number;
  name: string;
  dC: string;
  idOrder: number;
  idUser: number;
}

export interface TaskCreateDTO {
  idOrder?: number;
  idOrderTaskParent?: number;
  idWork?: number;
  idExecutor?: number;
  dateFinishPlan?: string;
  description?: string;
  closeParentCheck?: boolean;
  idTaskState?: number;
  idCreator?: number;
}

export interface TaskUpdateDTO { 
  idOrder?: number;
  idOrderTaskParent?: number;
  idWork?: number;
  idExecutor?: number;
  dateFinishPlan?: string;
  dateFinishFact?: string;
  description?: string;
  closeParentCheck?: boolean;
  idTaskState?: number;
  dateCreated?: string;
  idCreator?: number;
  resultText?: string;
}