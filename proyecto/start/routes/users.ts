import Route from '@ioc:Adonis/Core/Route'


Route.post("/register","UsersController.store");
Route.post("/login","SecuritiesController.login");
Route.post("/forgot","SecuritiesController.forgotPassword");
Route.post("/logout","SecuritiesController.logout");
Route.post("/reset","SecuritiesController.resetPassword");

Route.group(()=>{
    Route.get("/users","UsersController.index");
    Route.post("/users/testEmail","UsersController.testEmail");
    Route.get("/users/:id","UsersController.show");
    Route.put("/users/:id","UsersController.update");
    Route.delete("/users/:id","UsersController.destroy");

    //Auth 
    

}).middleware(['auth:api','permission'])




