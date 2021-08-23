const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
// const PORT = process.env.PORT || 3001;
// const app = express();

//Main menu for application
const mainMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                "Add Employee",
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department', 
                'Quit'
            ],
            initial: 1
        },
    ])
        //runs corresponding Questions or ends application
        .then((answer) => {
            if (answer.menu == 'View All Employees') {
                employeeRoster();
            }
            else if (answer.menu == 'Add Employee') {
                addEmployee();
            }
            else if (answer.menu == 'Update Employee Role') {
                updateEmployee();
            }
            else if (answer.menu == 'View All Roles') {
                viewRoles();
            }
            else if (answer.menu == 'Add Role') {
                addRole();
            }
            else if (answer.menu == 'View All Departments') {
                viewDepartments();
            }
            else if (answer.menu == 'Add Department') {
                addDepartment();
            }
            else {
                console.log('Application terminated.');
            }


        });

};