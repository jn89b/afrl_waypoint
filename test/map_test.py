import sys
import io
import folium # pip install folium
from PyQt5.QtWidgets import QApplication, QWidget, QHBoxLayout, QVBoxLayout
from PyQt5.QtWebEngineWidgets import QWebEngineView # pip install PyQtWebEngine

"""
Folium in PyQt5
"""

class LatLngPopup(MacroElement):
    """
    When one clicks on a Map that contains a LatLngPopup,
    a popup is shown that displays the latitude and longitude of the pointer.

    """
    _template = Template(u"""
            {% macro script(this, kwargs) %}
                var {{this.get_name()}} = L.popup();
                function latLngPop(e) {
                data = e.latlng.lat.toFixed(4) + "," + e.latlng.lng.toFixed(4);
                    {{this.get_name()}}
                        .setLatLng(e.latlng)
                        .setContent( "<br /><a href="+data+"> click </a>")
                        .openOn({{this._parent.get_name()}})
                    }
                {{this._parent.get_name()}}.on('click', latLngPop);

            {% endmacro %}
            """)  # noqa

    def __init__(self):
        super(LatLngPopup, self).__init__()
        self._name = 'LatLngPopup'


class MyApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Air Force Research UAS Testing')
        self.window_width, self.window_height = 1600, 1200
        self.setMinimumSize(self.window_width, self.window_height)

        layout = QVBoxLayout()
        self.setLayout(layout)

        coordinate = (34.9824325, -117.8645410)
        # coordinate = (34.9824325, 117.8645410)
        m = folium.Map(
        	tiles='openstreetmap',
        	zoom_start=14,
        	location=coordinate
        )

        # create a rectangle object and add to map
        folium.Rectangle([(34.983383777147296,-117.86574629149098), 
                            (34.9499769744304,-117.8330694298933)],
                            color="green",
                            weight=2,
                            fill=True,
                            fill_color="pink",
                            fill_opacity=0.5).add_to(m)

        # save map data to data object
        data = io.BytesIO()
        #m.save(data, close_file=False)
        m.save("test.html")

        webView = QWebEngineView()
        #webView.setHtml(data.getvalue().decode())
        webView.setHtml("test.html")
        layout.addWidget(webView)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    app.setStyleSheet('''
        QWidget {
            font-size: 35px;
        }
    ''')
    
    myApp = MyApp()
    myApp.show()
    

    try:
        sys.exit(app.exec_())
    except SystemExit:
        print('Closing Window...')
