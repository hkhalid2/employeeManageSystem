DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  FOREIGN KEY (role_id)
  REFERENCES role(id)
  
);
