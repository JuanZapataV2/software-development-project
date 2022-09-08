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

Route.get("/users","UsersController.index");
Route.post("/users","UsersController.store");
Route.post("/users/testEmail","UsersController.testEmail");
Route.get("/users/:id","UsersController.show");
Route.put("/users/:id","UsersController.update");
Route.delete("/users/:id","UsersController.destroy");

Route.get("/users/drivers","DriversController.index");
Route.post("/users/drivers","DriversController.store");
Route.get("/users/drivers/:id","DriversController.show");
Route.put("/users/drivers/:id","DriversController.update");
Route.delete("/users/drivers/:id","DriversController.destroy");

Route.get("/users/owners","ParkingOwnersController.index");
Route.post("/users/owners","ParkingOwnersController.store");
Route.get("/users/owners/:id","ParkingOwnersController.show");
Route.put("/users/owners/:id","ParkingOwnersController.update");
Route.delete("/users/owners/:id","ParkingOwnersController.destroy");


Route.get("/roles","RolesController.index");
Route.post("/roles","RolesController.store");
Route.get("/roles/:id","RolesController.show");
Route.put("/roles/:id","RolesController.update");
Route.delete("/roles/:id","RolesController.destroy");

Route.get("/vehicles","VehiclesController.index");
Route.post("/vehicles","VehiclesController.store");
Route.get("/vehicles/:id","VehiclesController.show");
Route.put("/vehicles/:id","VehiclesController.update");
Route.delete("/vehicles/:id","VehiclesController.destroy");

Route.get("/vehicles/car","CarsController.index");
Route.post("/vehicles/car","CarsController.store");
Route.get("/vehicles/car/:id","CarsController.show");
Route.put("/vehicles/car/:id","CarsController.update");
Route.delete("/vehicles/car/:id","CarsController.destroy");

Route.get("/vehicles/motorcycle","MotorcyclesController.index");
Route.post("/vehicles/motorcycle","MotorcyclesController.store");
Route.get("/vehicles/motorcycle/:id","MotorcyclesController.show");
Route.put("/vehicles/motorcycle/:id","MotorcyclesController.update");
Route.delete("/vehicles/motorcycle/:id","MotorcyclesController.destroy");


Route.get("/permission","PermissionsController.index");
Route.post("/permission","PermissionsController.store");
Route.get("/permission/:id","PermissionsController.show");
Route.put("/permission/:id","PermissionsController.update");
Route.delete("/permission/:id","PermissionsController.destroy");

Route.get("/permission-roles","RolePermissionsController.index");
Route.post("/permission-roles","RolePermissionsController.store");
Route.get("/permission-roles/:id","RolePermissionsController.show");
Route.put("/permission-roles/:id","RolePermissionsController.update");
Route.delete("/permission-roles/:id","RolePermissionsController.destroy");

Route.get("/driver-vehicles","DriverVehiclesController.index");
Route.post("/driver-vehicles","DriverVehiclesController.store");
Route.get("/driver-vehicles/:id","DriverVehiclesController.show");
Route.put("/driver-vehicles/:id","DriverVehiclesController.update");
Route.delete("/driver-vehicles/:id","DriverVehiclesController.destroy");

Route.post("/login","SecuritiesController.login");
Route.post("/forgot","SecuritiesController.forgotPassword");
Route.post("/reset","SecuritiesController.resetPassword");
Route.post("/logout","SecuritiesController.logout");