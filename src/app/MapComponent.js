"use client"
import DetailPopup from './components/DetailPopup';
import ImporterTable from './components/ImporterTable';
import ExporterTable from './components/ExporterTable';
import FPOTable from './components/FPOTable';
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { boundingExtent } from 'ol/extent';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls } from 'ol/control';


export default function MapComponent() {
    const mapRef = useRef(null);
    const popupRef = useRef(null);
    const [mapObj, setMapObj] = useState(null);
    const [selectedCommodity, setSelectedCommodity] = useState('');
    const [sidebarInfo, setSidebarInfo] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [commodities, setCommodities] = useState([]);
    const [commodityOptions, setCommodityOptions] = useState([]);
    const [importers, setImporters] = useState([]);
    const [showImporterTable, setShowImporterTable] = useState(false);
    const [showExporterTable, setShowExporterTable] = useState(false);
    const [exporters, setExporters] = useState([]);
    const [showFPOTable, setShowFPOTable] = useState(false);
    const [fpos, setFpos] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchCommodityOptions = async () => {
            const response = await fetch('/api/commodities');
            const data = await response.json();
            setCommodityOptions(data.data || []);
            console.log('Commodity options:', data.data);
        };
        fetchCommodityOptions();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/commodities');
            const result = await response.json();
            const commoditiesData = result.data || [];
            console.log('Commodity data:', commoditiesData);
            setCommodities(commoditiesData);

            // Get unique commodity names
            const uniqueNames = [...new Set(commoditiesData.map(item => item.name))];
            setCommodityOptions(uniqueNames);

            if (selectedCommodity) {
                const importersRes = await fetch(`/api/importers?commodity=${selectedCommodity}`);
                const importersData = await importersRes.json();
                setImporters(importersData.data || []);

                const exportersRes = await fetch(`/api/exporters?commodity=${selectedCommodity}`);
                const exportersData = await exportersRes.json();
                console.log('Fetched exporters data:', exportersData);
                setExporters(exportersData.data || []);

                const fposRes = await fetch(`/api/fpos?commodity=${selectedCommodity}`);
                const fposData = await fposRes.json();
                console.log('Fetched FPOs data:', fposData);
                setFpos(fposData.data || []);
            }
        };
        fetchData();
    }, [selectedCommodity]);

    useEffect(() => {
        if (!mapObj) {
            const initialMap = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([0, 0]),
                    zoom: 2,
                    constrainResolution: true,
                    maxZoom: 19,
                    minZoom: 2
                }),
                controls: defaultControls({
                    zoomOptions: {
                        zoomInTipLabel: 'Zoom in',
                        zoomOutTipLabel: 'Zoom out',
                        delta: 1
                    }
                })
            });

            const popup = new Overlay({
                element: popupRef.current,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250,
                },
            });
            initialMap.addOverlay(popup);

            let hoverTimeout;

            initialMap.on('pointermove', (event) => {
                const feature = initialMap.forEachFeatureAtPixel(event.pixel, (feat) => feat);
                if (feature) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = setTimeout(() => {
                        const { company, weight, quantity_mt, type, year } = feature.getProperties();
                        const coordinates = feature.getGeometry().getCoordinates();
                        popup.setPosition(coordinates);

                        const content = type === 'importer'
                            ? `
                    <div style="color: #1e293b; font-size: 14px; width: 200px;">
                        <div><strong style="color: #475569">Importer:</strong> ${company}</div>
                        <div><strong style="color: #475569">Import Quantity:</strong> ${quantity_mt} MT</div>
                        <div><strong style="color: #475569">Year:</strong> ${year}</div>
                    </div>
                `
                            : `
                    <div style="color: #1e293b; font-size: 14px; width: 200px;">
                        <div><strong style="color: #475569">Commodity:</strong> ${selectedCommodity}</div>
                        <div><strong style="color: #475569">Company:</strong> ${company}</div>
                        <div><strong style="color: #475569">Weight:</strong> ${weight} kg</div>
                    </div>
                `;

                        popupRef.current.innerHTML = content;
                        popupRef.current.style.display = 'block';
                    }, 200);
                } else {
                    clearTimeout(hoverTimeout);
                    popupRef.current.style.display = 'none';
                }
            });

            initialMap.on('click', (event) => {
                clearTimeout(hoverTimeout);
                popupRef.current.style.display = 'none';

                // Prevent event propagation on mobile
                if (isMobile) {
                    event.stopPropagation();
                }

                const feature = initialMap.forEachFeatureAtPixel(event.pixel, (feat) => feat);
                if (feature) {
                    // Force close all tables first
                    setShowImporterTable(false);
                    setShowExporterTable(false);
                    setShowFPOTable(false);

                    // Add slight delay for mobile
                    setTimeout(() => {
                        const { company, weight, quantity_mt, longitude, latitude, type, year } = feature.getProperties();
                        setSidebarInfo({
                            type,
                            commodity: selectedCommodity,
                            company,
                            weight: weight,
                            quantity_mt: quantity_mt,
                            year: year,
                            coordinates: [longitude, latitude]
                        });
                        setIsSidebarOpen(true);
                    }, isMobile ? 100 : 0);
                } else {
                    setIsSidebarOpen(false);
                    setSidebarInfo(null);
                }
            });


            setMapObj(initialMap);
        }
    }, [mapObj, selectedCommodity]);

    useEffect(() => {
        if (mapObj && selectedCommodity) {
            const layersToRemove = [];
            mapObj.getLayers().forEach((layer) => {
                if (layer instanceof VectorLayer) {
                    layersToRemove.push(layer);
                }
            });
            layersToRemove.forEach((layer) => {
                mapObj.removeLayer(layer);
            });

            const filteredCommodities = commodities.filter(commodity =>
                commodity && commodity.name && commodity.name === selectedCommodity
            );

            // Define commodityFeatures first
            const commodityFeatures = filteredCommodities.map((commodity) => {
                const markerCoord = fromLonLat([commodity.longitude, commodity.latitude]);
                const marker = new Feature({
                    geometry: new Point(markerCoord),
                    company: commodity.company,
                    weight: commodity.weight,
                    longitude: commodity.longitude,
                    latitude: commodity.latitude,
                    type: 'commodity'
                });

                marker.setStyle(
                    new Style({
                        image: new Icon({
                            src: 'https://openlayers.org/en/v6.5.0/examples/data/icon.png',
                            scale: 0.7,
                        }),
                    })
                );
                return marker;
            });

            // In the useEffect where we handle features
            const importerFeatures = Array.isArray(importers) ? importers
                .filter(importer => importer.commodity.name === selectedCommodity)
                .map((importer) => {
                    const markerCoord = fromLonLat([importer.longitude, importer.latitude]);
                    const marker = new Feature({
                        geometry: new Point(markerCoord),
                        company: importer.company,
                        quantity_mt: importer.quantity_mt,
                        year: importer.year,
                        longitude: importer.longitude,
                        latitude: importer.latitude,
                        type: 'importer'
                    });

                    marker.setStyle(
                        new Style({
                            image: new Icon({
                                src: 'https://openlayers.org/en/v6.5.0/examples/data/icon.png',
                                scale: 0.7,
                                color: '#dc2626'
                            }),
                        })
                    );
                    return marker;
                }) : [];

            const vectorSource = new VectorSource({
                features: [...commodityFeatures, ...importerFeatures]
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource
            });

            mapObj.addLayer(vectorLayer);

            const extent = vectorSource.getExtent();
            mapObj.getView().fit(extent, {
                duration: 1000,
                padding: [100, 100, 100, 100],
                maxZoom: 10
            });
        }
    }, [mapObj, selectedCommodity, commodities, importers]);

    return (
        <div style={{
            height: isMobile ? 'calc(100vh - 60px)' : '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: isMobile ? '10px' : '20px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 10,
            }}>
                <select
                    value={selectedCommodity}
                    onChange={(e) => setSelectedCommodity(e.target.value)}
                    style={{
                        fontSize: isMobile ? '14px' : '16px',
                        padding: isMobile ? '8px 12px' : '10px 15px',
                        width: isMobile ? '180px' : '220px',
                        backgroundColor: 'white',
                        color: 'black',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                >
                    <option value="">Select Commodity</option>
                    {[...new Set(commodities.map(commodity => commodity.name))].map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>
            <div ref={mapRef} style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}></div>
            <div ref={popupRef} style={{
                position: 'absolute',
                backgroundColor: 'white',
                padding: '5px',
                borderRadius: '5px',
                display: 'none',
                zIndex: 1000,
                fontSize: isMobile ? '10px' : '12px',
                minWidth: isMobile ? '150px' : '170px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
            }}></div>

            {isSidebarOpen && sidebarInfo && (
                <DetailPopup
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    data={sidebarInfo}
                    onShowImporters={() => setShowImporterTable(true)}
                    onShowExporters={() => setShowExporterTable(true)}
                    onShowFPOs={() => setShowFPOTable(true)}
                    isMobile={isMobile}
                    isTablet={isTablet}
                />
            )}

            <ImporterTable
                isOpen={showImporterTable}
                onClose={() => setShowImporterTable(false)}
                importers={importers.filter(importer => 
                    importer.commodity?.name === selectedCommodity
                )}
                selectedCommodity={selectedCommodity}
                isMobile={isMobile}
            />

            <ExporterTable
                isOpen={showExporterTable}
                onClose={() => setShowExporterTable(false)}
                exporters={exporters.filter(exporter => 
                    exporter.commodity?.name === selectedCommodity
                )}
                selectedCommodity={selectedCommodity}
                isMobile={isMobile}
            />

            <FPOTable
                isOpen={showFPOTable}
                onClose={() => setShowFPOTable(false)}
                fpos={fpos.filter(fpo => 
                    fpo.commodity?.name === selectedCommodity
                )}
                selectedCommodity={selectedCommodity}
                isMobile={isMobile}
            />
        </div>
    );
}
