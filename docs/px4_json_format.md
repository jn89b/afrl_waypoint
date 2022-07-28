# PX4 mission .plan file
https://dev.qgroundcontrol.com/master/en/file_formats/plan.html

This is just a JSON file, biggest keys in the JSON file we care about are:
-geoFence 
-mission

For data structure let flight_plan be a dictionary that we will change to JSON

## Geofence 
- Need to set polygons to geofence decimal lat/long of the grid coordinates so:

```js script
flight_plan["geoFence"]["polygons"]= c1_coordinates
```

## mission
- "mission" key has to have "cruisespeed","firmwareType", "globalPlanAltitudeMode", and "hoverSpeed" defined.
- After that set values of items that is list of dictionaries 
- Need to set plannedHomePosition, probably location of laptop, need to get altitude.
  
```js script
flight_plan["mission"]["items"]= [list_of_item_dictionaries]

flight_plan["plannedHomePosition"] = [lat,long,altitude]

flight_plan["mission"]["plannedHomePosition"] = [homelat, home_long, home_alt]

flight_plan["vehicleType"] = 1
flight_plan["version"] = 2

list_of_item_dictionaries[0] = {              "AMSLAltAboveTerrain": null,
                "Altitude": 30,
                "AltitudeMode": 1,
                "autoContinue": true,
                "command": 16,
                "doJumpId": 2,
                "frame": 3,
                "params": [
                    // 0,
                    // 0,
                    // 0,
                    // null,
                    // 34.98275058644367,
                    // -117.85542935056256,
                    // 30
                ],
                "type": "SimpleItem"}
```



