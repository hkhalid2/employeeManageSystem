INSERT INTO department_id (id, name)
VALUES (1, "HR"),
       (2, "Engineering");

INSERT INTO role (id, title, salary, department_id)
VALUES (300, "Junior Engineer", 65000, 2),
       (132, "Hiring Representative", 40000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3112, "Jim", "Boe",  300, 4457),
       (4127, "Cathy", "Dingo", 132, 4557);