import { IEmployee } from './employee.interface';

export class EmployeeModel implements IEmployee {
    employee_id?: number;
    name: string;
    username: string;
    password: string;
    state: number;
}