
// Import and require mysql2/inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');

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
                console.log('Application terminated.');
            }


        });

};

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
            const newDepartment = `INSERT INTO department (department_name)
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
    return inquirer.prompt([

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
            type: "list",
            name: "depid",
            message: "What school is this Role's Department?",
            choices: 
        },
    ])
        //adds new Intern team member's HTML to team array and sends user back to menu
        .then((answers) => {
            const newRole = `INSERT INTO department (department_name)
              VALUES ("${answers.rolename}", "${answers.salary}", "${answers.depid}" );`;
            
            db.query(newRole, (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
            console.log('Added Role to Database')
            mainMenu();
        })
};

mainMenu();