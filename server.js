
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
                        roles.title AS roles,
                        department.name AS department,
                        roles.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                        FROM employee
                        JOIN roles on employee.role_id = roles.id
                        JOIN department ON roles.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id;
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
                        roles.id,
                        roles.title,
                        department.name AS department,
                        roles.salary
                        FROM roles
                        JOIN department ON roles.department_id = department.id;
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
    //pull department names from db
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

    //searches db to match department with its department id
    const pullDeptID = `SELECT id
                        FROM department
                        WHERE department.name = "${answers.department}";`;

    let deptIDquery = await db.promise().query(pullDeptID);
    let deptID = deptIDquery[0][0].id;

    const newRole = `INSERT INTO roles (title, salary, department_id)
              VALUES ("${answers.rolename}", "${answers.salary}", "${deptID}" );`;

    //adds new role too database.
    db.query(newRole, (err, result) => {
        if (err) {
            console.log(err);
        }
    })

    console.log('Added Role to Database')
    mainMenu();

};

const addEmployee = async () => {
    //pull role titles from db
    const pullRole = `SELECT roles.title AS titles
                      FROM roles;`;

    var roleQuery = await db.promise().query(pullRole);
    let array = JSON.stringify(roleQuery[0]);
    let parse = JSON.parse(array);
    var rolelist = [];
    for (i = 0; i < parse.length; i++) {
        var role = { name: parse[i].titles }
        rolelist.push(role)
    };


    //pull possible manager names from db
    const pullMan = `SELECT CONCAT(first_name, ' ', last_name) AS name
                     FROM employee;`;

    var manQuery = await db.promise().query(pullMan);
    let manlist = manQuery[0];

    answers = await inquirer.prompt([

        {
            type: "input",
            name: "firstname",
            message: "What is the new Employee's firstname?",
        },

        {
            type: "input",
            name: "lastname",
            message: "What is the new Employee's lastname?",
        },

        {
            type: "list",
            name: "roleselect",
            message: "What Role is the Employee hired for?",
            choices: rolelist,
            initial: 1
        },

        {
            type: "list",
            name: "manage",
            message: "What manager would the Employee work under?",
            choices: manlist,
            initial: 1
        }


    ]);

    //searches db to match department with its department id
    const pullRoleID = `SELECT id
                        FROM roles
                        WHERE roles.title = "${answers.roleselect}";`;

    let roleIDquery = await db.promise().query(pullRoleID);
    let roleID = roleIDquery[0][0].id;

    //searches db to match selected manager with their employee id
    const pullmanID = `SELECT id
                       FROM employee
                       WHERE CONCAT(employee.first_name, ' ', employee.last_name) = "${answers.manage}";`;

    let manIDquery = await db.promise().query(pullmanID);
    let manID = manIDquery[0][0].id;

    const newEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
              VALUES ("${answers.firstname}", "${answers.lastname}", "${roleID}", "${manID}");`;

    //adds new role too database.
    db.query(newEmployee, (err, result) => {
        if (err) {
            console.log(err);
        }
    })

    console.log('Added Employee to Database')
    mainMenu();
};

const updateEmployee = async () => {
    //pull all employees from db
    const pullEmp = `SELECT CONCAT(first_name, ' ', last_name) AS name
                    FROM employee;`;

    var EmpQuery = await db.promise().query(pullEmp);
    let emplist = EmpQuery[0];

    //pull all roles from db
    const pullRole = `SELECT roles.title AS titles
                      FROM roles;`;

    var roleQuery = await db.promise().query(pullRole);
    let array = JSON.stringify(roleQuery[0]);
    let parse = JSON.parse(array);
    var rolelist = [];
    for (i = 0; i < parse.length; i++) {
        var role = { name: parse[i].titles }
        rolelist.push(role)
    };

    answers = await inquirer.prompt([

        {
            type: "list",
            name: "empselect",
            message: "What Employee needs to be updated?",
            choices: emplist,
            initial: 1
        },

        {
            type: "list",
            name: "roleselect",
            message: "What new Role should the employee have?",
            choices: rolelist,
            initial: 1
        }


    ]);
    //get chosen role ID
    const pullRoleID = `SELECT id
                        FROM roles
                        WHERE roles.title = "${answers.roleselect}";`;

    let roleIDquery = await db.promise().query(pullRoleID);
    let roleID = roleIDquery[0][0].id;

    //get chosen Employee ID
    const pullempID = `SELECT id
                       FROM employee
                       WHERE CONCAT(employee.first_name, ' ', employee.last_name) = "${answers.empselect}";`;

    let empIDquery = await db.promise().query(pullempID);
    let empID = empIDquery[0][0].id;

    const updateEmployee = `UPDATE employee 
                            SET employee.role_id = ${roleID}
                            WHERE employee.id = ${empID};`;

    //adds new role too database.
    db.query(updateEmployee, (err, result) => {
        if (err) {
            console.log(err);
        }
    })



    console.log('Employee Role Updated')
    mainMenu();
};

mainMenu();