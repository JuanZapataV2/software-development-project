import Route from '@ioc:Adonis/Core/Route'


Route.post("/users","UsersController.store");

Route.group(()=>{
    Route.get("/users","UsersController.index");
    Route.post("/users/testEmail","UsersController.testEmail");
    Route.get("/users/:id","UsersController.show");
    Route.put("/users/:id","UsersController.update");
    Route.delete("/users/:id","UsersController.destroy");
})