import Route from '@ioc:Adonis/Core/Route'

Route.get("/reservation/finish/:res_id","ReservationsController.finish");
Route.get("/reservation/myReservations/:driver_id","ReservationsController.getByUser");


Route.group(()=>{
    //RESERVATION
    Route.get("/reservation","ReservationsController.index");
    Route.get("/reservationVehicle/:vehicle_id","ReservationsController.indexVehicle");
    Route.post("/reservation","ReservationsController.store");
    Route.get("/reservation/:id","ReservationsController.show");
    Route.put("/reservation/:id","ReservationsController.update");
    Route.delete("/reservation/:id","ReservationsController.destroy");
}).middleware(['auth:api','permission'])

