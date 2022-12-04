import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    //VEHICULOS
    Route.get("/vehicles","VehiclesController.index");
    Route.get("/vehicles/plate/:license_plate","VehiclesController.findByPlate");
    Route.post("/vehicles","VehiclesController.store");
    Route.get("/vehicles/:id","VehiclesController.show");
    Route.put("/vehicles/:id","VehiclesController.update");
    Route.delete("/vehicles/:id","VehiclesController.destroy");

    //CARROS
    Route.get("/vehicles_car","CarsController.index");
    Route.post("/vehicles/car","CarsController.store");
    Route.get("/vehicles/car/:id","CarsController.show");
    Route.put("/vehicles/car/:id","CarsController.update");
    Route.delete("/vehicles/car/:id","CarsController.destroy");
    
    //MOTOS
    Route.get("/vehicles_motorcycle","MotorcyclesController.index");
    Route.post("/vehicles/motorcycle","MotorcyclesController.store");
    Route.get("/vehicles/motorcycle/:id","MotorcyclesController.show");
    Route.put("/vehicles/motorcycle/:id","MotorcyclesController.update");
    Route.delete("/vehicles/motorcycle/:id","MotorcyclesController.destroy");
}).middleware(['auth:api','permission'])