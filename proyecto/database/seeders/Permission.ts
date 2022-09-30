import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission';

export default class extends BaseSeeder {
  public async run () {
    await Permission.createMany([
      {
        url:"/users",
        method: "GET",
        id:1
      },
      {
        url:"/users",
        method: "PUT",
        id:2
      },
      {
        url:"/users",
        method: "DELETE",
        id:3
      },
      //PARKINGS
      {
        url:"/parking",
        method: "GET",
        id:4
      },
      {
        url:"/parking/#",
        method: "GET",
        id:5
      },
      {
        url:"/parking",
        method: "POST",
        id:6
      },
      {
        url:"/parking",
        method: "PUT",
        id:7
      },
      {
        url:"/parking",
        method: "DELETE",
        id:8
      },
      //PARKINGSPOTS
      {
        url:"/parkingSpot",
        method: "GET",
        id:9
      },
      {
        url:"/parkingSpot/#",
        method: "GET",
        id:10
      },
      {
        url:"/parkingSpot",
        method: "POST",
        id:11
      },
      {
        url:"/parkingSpot",
        method: "PUT",
        id:12
      },
      {
        url:"/parkingSpot",
        method: "DELETE",
        id:13
      },
      //PARKINGRATING
      {
        url:"/parkingRating",
        method: "GET",
        id:14
      },
      {
        url:"/parkingRating/#",
        method: "GET",
        id:15
      },
      {
        url:"/parkingRating",
        method: "POST",
        id:16
      },
      {
        url:"/parkingRating",
        method: "PUT",
        id:17
      },
      {
        url:"/parkingRating",
        method: "DELETE",
        id:18
      },
      //RESERVAIONS
      {
        url:"/reservation",
        method: "GET",
        id:19
      },
      {
        url:"/reservation/#",
        method: "GET",
        id:20
      },
      {
        url:"/reservation",
        method: "POST",
        id:21
      },
      {
        url:"/reservation",
        method: "PUT",
        id:22
      },
      {
        url:"/reservation",
        method: "DELETE",
        id:23
      },
      //VEHICLES
      {
        url:"/vehicles",
        method: "GET",
        id:24
      },
      {
        url:"/vehicles/#",
        method: "GET",
        id:25
      },
      {
        url:"/vehicles",
        method: "POST",
        id:26
      },
      {
        url:"/vehicles",
        method: "PUT",
        id:27
      },
      {
        url:"/vehicles",
        method: "DELETE",
        id:28
      },
      //VEHICLESCAR
      {
        url:"/vehicles_car",
        method: "GET",
        id:29
      },
      {
        url:"/vehicles_car/#",
        method: "GET",
        id:30
      },
      {
        url:"/vehicles_car",
        method: "POST",
        id:31
      },
      {
        url:"/vehicles_car",
        method: "PUT",
        id:32
      },
      {
        url:"/vehicles_car",
        method: "DELETE",
        id:33
      },
      //VEHICLESBIKE
      {
        url:"/vehicles_motorcycle",
        method: "GET",
        id:34
      },
      {
        url:"/vehicles_motorcycle/#",
        method: "GET",
        id:35
      },
      {
        url:"/vehicles_motorcycle",
        method: "POST",
        id:36
      },
      {
        url:"/vehicles_motorcycle",
        method: "PUT",
        id:37
      },
      {
        url:"/vehicles_motorcycle",
        method: "DELETE",
        id:38
      },    
      //PERMISSION
      {
        url:"/permission",
        method: "GET",
        id:39
      },
      {
        url:"/permission/#",
        method: "GET",
        id:40
      },
      {
        url:"/permission",
        method: "POST",
        id:41
      },
      {
        url:"/permission",
        method: "PUT",
        id:42
      },
      {
        url:"/permission",
        method: "DELETE",
        id:43
      },
      //permission-roles
      {
        url:"/permission-roles",
        method: "GET",
        id:44
      },
      {
        url:"/permission-roles/#",
        method: "GET",
        id:45
      },
      {
        url:"/permission-roles",
        method: "POST",
        id:46
      },
      {
        url:"/permission-roles",
        method: "PUT",
        id:47
      },
      {
        url:"/permission-roles",
        method: "DELETE",
        id:48
      },     

    ])
    // Write your database queries inside the run method
  }
}
