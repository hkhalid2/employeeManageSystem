
// Import and require mysql2/inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');


//connect to database and log into mysql
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'Ch1cken?',
        database: 'company_db'
    },
);


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
                return console.log('Application terminated.');
            }


        });

};

const employeeRoster = () => {
    const employeeSql = `SELECT DISTINCT
                        employee.id,
                        employee.first_name,
                        employee.last_name,
                        role.title AS role,
                        department.name AS department,
                        role.salary
                        FROM employee
                        JOIN role on employee.role_id = role.id
                        JOIN department ON role.department_id = department.id;
                        `
    db.query(employeeSql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        mainMenu();
    })
}

const viewDepartments = () => {
    const deptSql = `SELECT DISTINCT
                        department.id,
                        department.name AS department
                        FROM department
                        `
    db.query(deptSql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        mainMenu();
    })
}


const viewRoles = () => {
    const roleSql = `SELECT DISTINCT
                        role.id,
                        role.title,
                        department.name AS department,
                        role.salary
                        FROM role
                        JOIN department ON role.department_id = department.id;
                        `
    db.query(roleSql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        mainMenu();
    })
}

const addDepartment = async () => {
    return inquirer.prompt([

        {
            type: "input",
            name: "depname",
            message: "What is the Department's Name?",
        }
    ])
        //adds new Intern team member's HTML to team array and sends user back to menu
        .then((answers) => {
            const newDepartment = `INSERT INTO department (name)
              VALUES ("${answers.depname}");`;

            db.query(newDepartment, (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
            console.log('Added Department to Database')
            mainMenu();
        })
};

const addRole = async () => {

    const pullDept = `SELECT name
                      FROM department`;

    var depQuery = await db.promise().query(pullDept);
    let deplist = depQuery[0];

    answers = await inquirer.prompt([

        {
            type: "input",
            name: "rolename",
            message: "What is the new Role?",
        },

        {
            type: "input",
            name: "salary",
            message: "What is this Role's Salary?",
        },

        {
            type: 'list',
            name: 'department',
            message: 'What Department is this Role Located in?',
            choices: deplist,
            initial: 1
        }


    ])
    //adds new Intern team member's HTML to team array and sends user back to menu

    const pullDeptID = `SELECT id
                        FROM department
                        WHERE department.name = "${answers.department}";`;

    let deptIDquery = await db.promise().query(pullDeptID);
    let deptID = deptIDquery[0][0].id;

    const newRole = `INSERT INTO role (title, salary, department_id)
              VALUES ("${answers.rolename}", "${answers.salary}", "${deptID}" );`;

    db.query(newRole, (err, result) => {
        if (err) {
            console.log(err);
        }
    })
    console.log(answers.department);
    console.log('Added Role to Database')
    mainMenu();

};

mainMenu();