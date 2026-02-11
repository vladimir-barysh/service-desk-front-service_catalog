export interface OrderCreateDTO {
    name: string;
    description: string;
    dateFinishPlan?: string;
    idService?: number;
    idOrderType: number;
    resultText?: string;
}