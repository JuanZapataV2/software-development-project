/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//USERS
Route.get("/users","UsersController.index");
Route.post("/users","UsersController.store");
Route.post("/users/testEmail","UsersController.testEmail");
Route.get("/users/:id","UsersController.show");
Route.put("/users/:id","UsersController.update");
Route.delete("/users/:id","UsersController.destroy");

//ROLES
Route.get("/roles","RolesController.index");
Route.post("/roles","RolesController.store");
Route.get("/roles/:id","RolesController.show");
Route.put("/roles/:id","RolesController.update");
Route.delete("/roles/:id","RolesController.destroy");

//PERMISOS
Route.get("/permission","PermissionsController.index");
Route.post("/permission","PermissionsController.store");
Route.get("/permission/:id","PermissionsController.show");
Route.put("/permission/:id","PermissionsController.update");
Route.delete("/permission/:id","PermissionsController.destroy");

//SECURITY
Route.post("/login","SecuritiesController.login");
Route.post("/forgot","SecuritiesController.forgotPassword");
Route.post("/reset","SecuritiesController.resetPassword");
Route.post("/logout","SecuritiesController.logout");

//PARKING
Route.get("/parking","ParkingsController.index");
Route.post("/parking","ParkingsController.store");
Route.get("/parking/:id","ParkingsController.show");
Route.put("/parking/:id","ParkingsController.update");
Route.delete("/parking/:id","ParkingsController.destroy");

//RESERVATION
Route.get("/reservation","ReservationsController.index");
Route.post("/reservation","ReservationsController.store");
Route.get("/reservation/:id","ReservationsController.show");
Route.put("/reservation/:id","ReservationsController.update");
Route.delete("/reservation/:id","ReservationsController.destroy");

//PARKINGRATING
Route.get("/parkingRating","ParkingRatingsController.index");
Route.post("/parkingRating","ParkingRatingsController.store");
Route.get("/parkingRating/:id","ParkingRatingsController.show");
Route.put("/parkingRating/:id","ParkingRatingsController.update");
Route.delete("/parkingRating/:id","ParkingRatingsController.destroy");


//PARKINGSPOT
Route.get("/parkingSpot","ParkingSpotsController.index");
Route.post("/parkingSpot","ParkingSpotsController.store");
Route.get("/parkingSpot/:id","ParkingSpotsController.show");
Route.put("/parkingSpot/:id","ParkingSpotsController.update");
Route.delete("/parkingSpot/:id","ParkingSpotsController.destroy");
