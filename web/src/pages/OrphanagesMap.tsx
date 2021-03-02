import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import LeafLet from 'leaflet';
import {useParams} from 'react-router-dom'

import 'leaflet/dist/leaflet.css';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import '../styles/pages/orphanages-map.css';

import mapMarkerImg from '../images/map-marker.svg';

import api from '../services/api';

interface Orphanage {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

interface OrphanageParams {
    id: string;
}

const mapIcon  = LeafLet.icon({
    iconUrl: mapMarkerImg,

    iconSize: [59,68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 2]
});

function OrphanagesMap() {
    const params = useParams<OrphanageParams>();

    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect(() => {
        api.get(`orphanages/${params.id}`).then(response => {
            setOrphanages(response.data);
        })
    }, [params.id]);

    return (
        <div id="page-map">
            
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy" />
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças esperam pela sua visita!</p>
                </header>

                <footer>
                    <strong>Poá</strong>
                    <span>São Paulo</span>
                </footer>
                
            </aside>

            <Map 
                center={[ -23.5292585,-46.3336866 ]}
                zoom={15}
                style={{ width: '100%', height:'100%' }} >
                
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {orphanages.map(orphanage => {
                    return <Marker
                                icon={mapIcon}
                                position={[orphanage.latitude, orphanage.longitude]}
                            >
                                <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                                    Lar das meninas
                                    <a href={`/orphanages/${orphanage.id}`} >
                                        <FiArrowRight size={20} color="#FFF" />
                                    </a>
                                </Popup>
                            </Marker>
                })}

            </Map>
            
            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size="32" color="#000" />
            </Link>
        </div>
    );
}
 
export default OrphanagesMap;