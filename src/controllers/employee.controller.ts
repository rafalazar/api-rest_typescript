import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import jsonwebtoken from 'jsonwebtoken';

import { query } from '../query/query';

import { EmployeeModel } from '../interfaces/Employee';

require('../config/config');

export async function signUp(req: Request, res: Response, next) {

    const employee: EmployeeModel = req.body;

    const password = await bcrypt.hashSync(employee.password, 10);

    const createEmployeeQuery = `INSERT INTO employee (name, username, password, state) VALUES ('${employee.name}', '${employee.username}', '${password}', '${employee.state}')`;

    return await query(createEmployeeQuery).then(async createDataEmployee => {

        if (!createDataEmployee.ok) {
            return res.status(createDataEmployee.status).json({
                ok: false,
                message: createDataEmployee.message
            });
        }
        
        const employeeID = createDataEmployee.result[0].insertId;

        const newEmployee = new EmployeeModel();
        newEmployee.employee_id = employeeID;
        newEmployee.username = employee.username;

        const jwt = jsonwebtoken.sign({
            user: newEmployee
        }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });


        return res.json({
            ok: true,
            message: 'Employee was created!',
            token: jwt
        });

    });

}

export async function signIn(req: Request, res: Response) {

    const body = req.body;

    const queryGet = `SELECT * FROM employee WHERE username = '${body.username}'`;

    return await query(queryGet).then(async data => {

        try {
            if (!data.ok) {
                return res.status(data.status).json({
                    ok: false,
                    message: data.message,
                });
            }

            const employeeDB: EmployeeModel = data.result[0][0];

            console.log(employeeDB);

            if (employeeDB == null) {
                return res.status(400).json({
                    ok: false,
                    message: 'El usuario o la contraseña es incorrecto'
                });
            }

            const compare = await bcrypt.compareSync(body.password, employeeDB.password);
            if (!compare) {
                return res.status(400).json({
                    ok: false,
                    message: 'El usuario o la contraseña es incorrecto'
                });
            }

            if (employeeDB.state == 0) {
                return res.status(403).json({
                    ok: false,
                    message: 'Cuenta eliminado'
                });
            }

            return res.status(200).json({
                ok: true,
                message: 'Inicio de sesión correcto!',
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                message: e.toString(),
            });
        }

    });



}