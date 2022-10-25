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

import './routes/users'
import './routes/roles'
import './routes/parkings'
import './routes/vehicles'
import './routes/reservations'
import './routes/permission'
import './routes/profiles'



Route.get('/', async () => {
  return { hello: 'world' }
})



//ROLES
Route.get("/users_driver","DriversController.index");
Route.post("/users/drivers","DriversController.store");
Route.get("/users/drivers/:id","DriversController.show");
Route.put("/users/drivers/:id","DriversController.update");
Route.delete("/users/drivers/:id","DriversController.destroy");

Route.get("/users_owner","ParkingOwnersController.index");
Route.post("/users/owners","ParkingOwnersController.store");
Route.get("/users/owners/:id","ParkingOwnersController.show");
Route.put("/users/owners/:id","ParkingOwnersController.update");
Route.delete("/users/owners/:id","ParkingOwnersController.destroy");


Route.get("/driver-vehicles","DriverVehiclesController.index");
Route.post("/driver-vehicles","DriverVehiclesController.store");
Route.get("/driver-vehicles/:id","DriverVehiclesController.show");
Route.put("/driver-vehicles/:id","DriverVehiclesController.update");
Route.delete("/driver-vehicles/:id","DriverVehiclesController.destroy");









