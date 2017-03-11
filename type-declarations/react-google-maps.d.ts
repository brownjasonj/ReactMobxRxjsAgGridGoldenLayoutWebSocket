declare module 'react-google-maps' {
  import * as React from 'react'

  interface Properties {
    className?: string
    key?: string
    style?: Object
  }

  interface GoogleMapProperties extends Properties {
    defaultCenter: {lat: number, lng: number}
    defaultZoom: number
  }

  interface GoogleMapLoaderProperties extends Properties {
      containerElement: any;
      googleMapElement: any;
  }
  
  export class GoogleMapLoader extends React.Component<GoogleMapLoaderProperties, {}>{}
  export class GoogleMap extends React.Component<GoogleMapProperties, {}> {}
}