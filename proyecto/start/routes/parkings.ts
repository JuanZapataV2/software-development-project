import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    //PARKING
    
    Route.post("/parking","ParkingsController.store");
    
    Route.put("/parking/:id","ParkingsController.update");
    Route.delete("/parking/:id","ParkingsController.destroy");

}).middleware(['auth:api','permission'])
Route.get("/parking","ParkingsController.index");
Route.get("/parking/:id","ParkingsController.show");
Route.post("/parkingRating","ParkingRatingsController.store");
Route.get("/parkingRating","ParkingRatingsController.index");  
Route.get("/parkingRating/:id","ParkingRatingsController.show");
Route.get("/parkingRating/parking/:parking_id","ParkingRatingsController.getParkingReviews");

Route.group(()=>{
    //PARKINGRATING
    Route.put("/parkingRating/:id","ParkingRatingsController.update");
    Route.delete("/parkingRating/:id","ParkingRatingsController.destroy");
}).middleware(['auth:api','permission'])
Route.get("/parkingSpot","ParkingSpotsController.index");
Route.put("/parkingSpot/:id","ParkingSpotsController.update");
Route.get("/parkingSpot/parking/:id_parking","ParkingSpotsController.indexParking");
Route.group(()=>{
    //PARKINGSPOT
    
    
    Route.post("/parkingSpot","ParkingSpotsController.store");
    Route.get("/parkingSpot/:id","ParkingSpotsController.show");
    Route.get("/parkingSpot/getAll/:parking_id","ParkingSpotsController.getByParkingId");
    Route.get("/parkingSpot/getLast/:parking_id","ParkingSpotsController.getLastSpot");
    Route.delete("/parkingSpot/:id","ParkingSpotsController.destroy");
}).middleware(['auth:api','permission'])

