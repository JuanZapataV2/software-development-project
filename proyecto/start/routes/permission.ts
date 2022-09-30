import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get("/permission","PermissionsController.index");
    Route.post("/permission","PermissionsController.store");
    Route.get("/permission/:id","PermissionsController.show");
    Route.put("/permission/:id","PermissionsController.update");
    Route.delete("/permission/:id","PermissionsController.destroy");


    //SECURITY
    Route.get("/permission-roles","RolePermissionsController.index");
    Route.post("/permission-roles","RolePermissionsController.store");
    Route.get("/permission-roles/:id","RolePermissionsController.show");
    Route.put("/permission-roles/:id","RolePermissionsController.update");
    Route.delete("/permission-roles/:id","RolePermissionsController.destroy");
    
}).middleware(['auth:api','permission'])