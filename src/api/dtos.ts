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