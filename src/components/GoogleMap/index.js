import React from 'react';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';

// import mapStyles from './mapStyles.json';
import MapWrapper from './MapWrapper';
import Marker from './Marker';
import ClusterMarker from './ClusterMarker';

const markersData = [
  { id: 1, lat: -31.56391, lng: 147.154312 },
  { id: 2, lat: -33.718234, lng: 150.363181 },
  { id: 3, lat: -33.727111, lng: 150.371124 },
  { id: 4, lat: -33.848588, lng: 151.209834 },
  { id: 5, lat: -33.851702, lng: 151.216968 },
  { id: 6, lat: -34.671264, lng: 150.863657 },
  { id: 7, lat: -35.304724, lng: 148.662905 },
  { id: 8, lat: -36.817685, lng: 175.699196 },
  { id: 9, lat: -36.828611, lng: 175.790222 },
  { id: 10, lat: -37.75, lng: 145.116667 },
  { id: 11, lat: -37.759859, lng: 145.128708 },
  { id: 12, lat: -37.765015, lng: 145.133858 },
  { id: 13, lat: -37.770104, lng: 145.143299 },
  { id: 14, lat: -37.7737, lng: 145.145187 },
  { id: 15, lat: -37.774785, lng: 145.137978 },
  { id: 16, lat: -37.819616, lng: 144.968119 },
  { id: 17, lat: -38.330766, lng: 144.695692 },
  { id: 18, lat: -39.927193, lng: 175.053218 },
  { id: 19, lat: -41.330162, lng: 174.865694 },
  { id: 20, lat: -42.734358, lng: 147.439506 },
  { id: 21, lat: -42.734358, lng: 147.501315 },
  { id: 22, lat: -42.735258, lng: 147.438 },
  { id: 23, lat: -43.999792, lng: 170.463352 },
];

const MAP = {
  defaultZoom: 3,
  defaultCenter: { lat: -28.024, lng: 140.887 },
  options: {
    // styles: mapStyles,
    maxZoom: 19,
  },
};

export class GoogleMap extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    mapOptions: {
      center: MAP.defaultCenter,
      zoom: MAP.defaultZoom,
    },
    clusters: [],
  };

  getClusters = () => {
    const { mapOptions } = this.state;
    const clusters = supercluster(markersData, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    });

    return clusters(mapOptions);
  };

  createClusters = props => {
    const { mapOptions } = this.state;
    this.setState({
      clusters: mapOptions.bounds
        ? this.getClusters(props).map(({ wx, wy, numPoints, points }) => ({
            lat: wy,
            lng: wx,
            numPoints,
            id: `${numPoints}_${points[0].id}`,
            points,
          }))
        : [],
    });
  };

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      },
      () => {
        this.createClusters(this.props);
      }
    );
  };

  render() {
    const { clusters } = this.state;
    return (
      <MapWrapper>
        <GoogleMapReact
          defaultZoom={MAP.defaultZoom}
          defaultCenter={MAP.defaultCenter}
          options={MAP.options}
          onChange={this.handleMapChange}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{ key: 'your key' }}////AIzaSyAS3ix4rVY4A-T4yPzWlEi766ycl2mY818
        >
          {clusters.map(item => {
            if (item.numPoints === 1) {
              return <Marker key={item.id} lat={item.points[0].lat} lng={item.points[0].lng} />;
            }

            return (
              <ClusterMarker key={item.id} lat={item.lat} lng={item.lng} points={item.points} />
            );
          })}
        </GoogleMapReact>
      </MapWrapper>
    );
  }
}

export default GoogleMap;
