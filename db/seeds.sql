INSERT INTO department (name)
VALUES ("HR"),
       ("Engineering"),
       ("Finance"),
       ("Media");


INSERT INTO role (title, salary, department_id)
VALUES ("Junior Engineer", 65000, 2),
       ("Hiring Representative", 40000, 1),
       ("Head Engineer", 100000, 2),
       ("Accountant", 150000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Boe",  1, 1),
       ("Cathy", "Dingo", 1, 2),
       ("Mary", "Jane", 3, NULL);

