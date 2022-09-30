import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    //PARKING
    Route.get("/parking","ParkingsController.index");
    Route.post("/parking","ParkingsController.store");
    Route.get("/parking/:id","ParkingsController.show");
    Route.put("/parking/:id","ParkingsController.update");
    Route.delete("/parking/:id","ParkingsController.destroy");
}).middleware(['auth:api','permission'])

Route.group(()=>{
    //PARKINGRATING
    Route.get("/parkingRating","ParkingRatingsController.index");
    Route.post("/parkingRating","ParkingRatingsController.store");
    Route.get("/parkingRating/:id","ParkingRatingsController.show");
    Route.put("/parkingRating/:id","ParkingRatingsController.update");
    Route.delete("/parkingRating/:id","ParkingRatingsController.destroy");
}).middleware(['auth:api','permission'])

Route.group(()=>{
    //PARKINGSPOT
    Route.get("/parkingSpot","ParkingSpotsController.index");
    Route.get("/parkingSpot/parking/:id_parking","ParkingSpotsController.indexParking");
    Route.post("/parkingSpot","ParkingSpotsController.store");
    Route.get("/parkingSpot/:id","ParkingSpotsController.show");
    Route.put("/parkingSpot/:id","ParkingSpotsController.update");
    Route.delete("/parkingSpot/:id","ParkingSpotsController.destroy");
}).middleware(['auth:api','permission'])

