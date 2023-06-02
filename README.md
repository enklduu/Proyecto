# 13 Abril Floristerías

This is my TFG (thesis o undergraduate thesis project), in which I will be doing a shopping page for my brother's florist, the main purpose is to make this as a single page application by using React. 

It is not designed as sending but simply communication of the order to be made and online payment, 
Confirmation by email will be attempted as other **"on-the-fly"** implementations


## Installation

To use this proyect on your local machine

1. Clone the repository
```bash
git clone https://github.com/okami315/Proyecto.git
```

2. Install the dependencies of the back and front.
## Back
1. Install Symfony dependencies
```bash
cd back
```
```bash
composer install
```
2. Additionally you need to create a database and make the config on the **.env** file  
```bash
php bin/console doctrine:database:create
```
3. Generate the database and add some data
```bash
php bin/console doctrine:schema:create
php bin/console doctrine:schema:update --force
```
4. Start the local server for the backend (remember to have access to the database)
```bash
symfony server:start
```

## Front
1. Install React dependencies
```bash
cd front
```
```bash
npm install
```
2. Now you need to start the local server
```bash
npm start
```

### Now you can go to http://localhost:3000 and you will see the proyect running.