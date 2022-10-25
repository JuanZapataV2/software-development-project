import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get("/profiles","ProfilesController.index");
    Route.post("/profiles","ProfilesController.store");
    Route.get("/profiles/:id","ProfilesController.show");
    Route.put("/profiles/:id","ProfilesController.update");
    Route.delete("/profiles/:id","ProfilesController.destroy");
}).middleware(['auth:api'])
