import Route from '@ioc:Adonis/Core/Route'

Route.get("/roles","RolesController.index");

Route.group(()=>{
    Route.post("/roles","RolesController.store");
    Route.get("/roles/:id","RolesController.show");
    Route.put("/roles/:id","RolesController.update");
    Route.delete("/roles/:id","RolesController.destroy");
}).middleware(['auth:api','permission'])


