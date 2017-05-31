window.onload = function() {  
  // WMTS-Layer basemap.at - Quelle: http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml
        var layers = {
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        };
        // Karte definieren
        var map = L.map('map', {
            layers: [layers.geolandbasemap],
            center: [47.654, 13.370],
            zoom: 8
        });
        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);
        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        }).addTo(map);


        // leaflet-hash aktivieren
        var hash = new L.Hash(map);
        // var etappe = omnivore.gpx('data/AdlerwegEtappe21.gpx').addTo(map);
     
        var profile = L.control.elevation();

        //profileControl.addData(layer.feature);
        function loadTrack(track) {
            //console.log(track);
            //console.log("gpxFile ", track);
            console.log("etappeninfo: ", window.ETAPPENINFO);
			profile.clear();
            console.log("info : ", window.ETAPPENINFO[track]);
			console.log("Kurztext : ", window.ETAPPENINFO[track].Kurztext);
			document.getElementById("Kurztext").innerHTML = window.ETAPPENINFO[track].Kurztext;
			document.getElementById("Streckenbeschreibung").innerHTML = window.ETAPPENINFO[track].Streckenbeschreibung;
            //bestehende Linie, farbigen Track löschen?????
            //gpxTrackGroup.clearLayers();
            //coloredLineGroup.clearLayers();
            //profileControl.clear();

            etappe = omnivore.gpx('data/' + track).addTo(map);

            etappe.on("ready", function() {
                map.fitBounds(etappe.getBounds());
                etappe.eachLayer(function(layer) {
                    profile.addData(layer.feature);
                    //console.log("xxx");

                    //Stunde 24.05 gpx Punkte anzeigen
                    var pts = layer.feature.geometry.coordinates;
                    // Vorschleige
                    for (var i = 1; i < pts.length; i += 1) {
                        console.log(pts[i]); //aktueller Punkt
                        console.log(pts[i - 1]); //vorübergehender Punkt  
                        //Entfernung
                        var dist = map.distance(
                            [pts[i][1], pts[i][0]], [pts[i - 1][1], pts[i - 1][0]]

                        ).toFixed(0);
                        console.log(dist);
                        var delta = pts[i][2] - pts[i - 1][2];
                        //console.log(delta, "Höhenmeter auf", dist, "m Strecke");
                        var rad = Math.atan(delta / dist);
                        var deg = (rad * (180 / Math.PI)).toFixed(1);
                        //console.log(deg);
                        //colorbrewer		      
                        var rot = ["#ab2524", "#a02128", "#a1232b", "#8d1d2c", "#701f29", "#5e2028"];
                        var gruen = ["#42EB00", "#38C400", "#288F00", "#195700", "#0A2400"];
                        //console.log(rot);
                        //rot ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']
                        // blau ['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#2b8cbe','#045a8d']


                        var farbe;
                        switch (true) { // checks if condition is true, not for certain values of a variable
                            case (deg >= 20):
                                farbe = "#bd0026";
                                break;
                            case (deg >= 15):
                                farbe = "#f03b20";
                                break;
                            case (deg >= 10):
                                farbe = "#fd8d3c";
                                break;
                            case (deg >= 5):
                                farbe = "#feb24c";
                                break;
                            case (deg >= 1):
                                farbe = "#fed976";
                                break;
                            case (deg >= -1):
                                farbe = "yellow";
                                break;
                            case (deg >= -5):
                                farbe = "#d9f0a3";
                                break;
                            case (deg >= -10):
                                farbe = "#addd8e";
                                break;
                            case (deg >= -15):
                                farbe = "#78c679";
                                break;
                            case (deg >= -20):
                                farbe = "#31a354";
                                break;
                            case (deg < -20):
                                farbe = "#006837";
                                break;
                        }
                        console.log(deg, farbe);

                        // Linie zeichnen

                        var pointA = new L.LatLng(pts[i][1], pts[i][0]);
                        var pointB = new L.LatLng(pts[i - 1][1], pts[i - 1][0]);
                        var pointList = [pointA, pointB];
                        var firstpolyline = new L.Polyline(pointList, {
                            color: farbe,
                            weight: 6,
                            opacity: 0.5,
                            smoothFactor: 1
                        });

                        firstpolyline.addTo(map);
                    }
                });
            });
        }

        profile.addTo(map);
        //icons von https://mapicons.mapsmarker.com/
        //popup laden
        var markup = '<h3>Adlerweg-Etappe 21: Württemberger Haus – Memminger Hütte</h3>';
        markup += '<p> Ettape 21 geht vom Württemberger Haus zur Memminger Hütte. Steinböcke gelten, so wie das Edelweiß, als ein Symbol der Alpen. Entlang dieser Adlerweg-Etappe zur Memminger Hütte ergeben sich immer wieder Möglichkeiten, Steinböcke in freier Natur zu beobachten.Von der Hütte auf einem Steig zunächstein kurzes Stück hinunter. Dann werden sanft ansteigend Wiesenhänge und einSchuttkar gequert, ehe der Steig mitunter steil durch eine felsdurchsetzte Grasflanke (eine seilversicherte Stelle) zum Grat leitet. Nun links und rechts des Grats fast eben nach Norden zum Gipfel der Großbergspitze (Holzkreuz). Von der Großbergspitze führt die Route am Gratrücken ein kleines Stück sanft hinab. Ein Felsriegel wird – ansteigend – mit Hilfe von Drahtseilen überwunden, anschließend mit wenigen Schritten nach oben zum Großbergkopf. Jetzt geht es links vom Grat auf dem schottrigen Steig recht abschüssig und ausgesetzt wieder hinunter und vorbei am Großbergjoch. Danach werden – zunächst weiter absteigend – Wiesenhänge gequert, bis der Steig erneut hinaufzieht. Er quert ein Schuttkar und führt zum Schluss steiler empor zur Seescharte. Von dort auf der anderen Seite durch Schutt, Geröll und auf erdigem Boden hinab. Der Steig leitet oberhalb einer kleinen Schlucht entlang und führt ins Wiesengelände. Schließlich vorbei am größten See im Bereich der Hütte ans Etappenziel</p>';
        markup += '<li>Ausgangspunkt: Württemberger Haus</li>';
        markup += '<li>Endpunkt: Memminger Hütte</li>';
        markup += '<li>Höhenmeter bergauf: 670</li>';
        markup += '<li>Höhenmeter bergab: 650</li>';
        markup += '<li>Höchster Punkt: 2623</li>';
        markup += '<li>Schwierigkeitsgrad: schwierig</li>';
        markup += '<li>Streckenlänge (in km): 7</li>';
        markup += '<li>Gehzeit (in Stunden): 5</li>';
        markup += '<li>Einkehrmöglichkeiten: Württemberger Haus,Memminger Hütte</li>';
        //markup += '<li><a href="http://www.tirol.at/reisefuehrer/sport/wandern/wandertouren/a-adlerweg-etappe-1-st-johann-gaudeamushuette">Weitere Informationen</a></li>';


        var huts = [
            L.marker([47.20050, 10.47859], {
                title: "Württemberger Haus",
                icon: L.icon({
                    iconUrl: 'icons/cabin.png'
                })
            }),
            L.marker([47.21060, 10.53520], {
                title: "Memminger Hütte",
                icon: L.icon({
                    iconUrl: 'icons/cabin.png'
                })
            }),
            L.marker([47.19304, 10.49587], {
                title: "Wandern auf dem Adlerweg: Etappe 21",
                icon: L.icon({
                    iconUrl: 'icons/hiking.png'
                })
            }),

        ];
        var hutsLayer = L.featureGroup();
        for (var i = 0; i < huts.length; i++) {
            hutsLayer.addLayer(huts[i]);
        }

        //hutsLayer.addTo(map);
        map.on("zoomend", function() {
            if (map.getZoom() >= 15) {
                map.addLayer(hutsLayer);
            } else {
                map.removeLayer(hutsLayer);
            }
        });
        var etappenSelektor = document.getElementById("etappen");
        etappenSelektor.onchange = function(evt) {
            console.log("change event", evt);
            console.log("GPX Track laden: ", etappenSelektor[etappenSelektor.selectedIndex].value);
            loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
            //loadTrack('AdlerwegEtappe21.gpx')
        }
		loadTrack('AdlerwegEtappe21.gpx');
		};