#testing arcgis offline module 

from arcgis.gis import GIS
from arcgis.mapping import WebMap
gis = GIS('home')

wm_item = gis.content.get('7f88050bf48749c6b9d82634f04b6362')
fire_webmap = WebMap(wm_item)


for bookmark in fire_webmap.definition.bookmarks:
    print(bookmark.name)

offline_item_properties = {'title': 'Offline area for Southern California',
                          'tags': ['Python', 'automation', 'fires'],
                          'snippet': 'Area created for first responders'}

socal_offline_item = fire_webmap.offline_areas.create(area = fire_webmap.definition.bookmarks[1].name,
                                                     item_properties = offline_item_properties,
                                                     min_scale = 147914000,
                                                     max_scale = 73957000)
                                                     