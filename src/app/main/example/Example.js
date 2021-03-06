import React, { Component } from 'react'
import Highmaps from 'highcharts/highmaps'
import { Fetch } from 'react-request'
import {
  HighchartsMapChart, withHighmaps, Title, Subtitle, Tooltip, Legend, XAxis, YAxis, MapSeries, MapLineSeries, MapBubbleSeries, MapNavigation, Credits
} from 'react-jsx-highmaps'
/* import ExampleCode from '../utils/ExampleCode'
import code from './exampleCode' */

import "./exemple.scss"

Highmaps.setOptions({
  lang: { thousandsSep: ',' }
})

class App extends Component {

  state = {
    populationData: null
  }

  componentDidMount () {
    fetch('https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/us-capitals.json')
      .then(res => {
        if (res.ok) return res.json()
      })
      .then(json => {
        const populationData = json.map(
          ({ population, ...rest }) => ({ ...rest, z: population })
        )

        this.setState({
          populationData
        })
      })
  }

  render () {
    const { populationData } = this.state
    return (
      <div style={{height:"100%"}} className="app">
        <Fetch url="http://code.highcharts.com/mapdata/countries/tn/tn-all.geo.json">
          {({ fetching, failed, data }) => {
            if (fetching) return <div>Loading…</div>
            if (failed) return <div>Failed to load map.</div>

            if (data) {
              return (
                <HighchartsMapChart className="chartHeight" map={data}>
                  <Title>Covid-19 Real Time info</Title>

                  <Subtitle>Tunisia Capitals</Subtitle>

                  <XAxis crosshair={{ snap: false }} />

                  <YAxis crosshair={{ snap: false }}>
                    <MapSeries
                      mapData={data}
                      borderColor="#606060"
                      nullColor="rgba(200, 200, 200, 0.2)"
                      showInLegend={false}
                    />

                    <MapLineSeries
                      data={Highmaps.geojson(data, 'mapline')}
                      color="gray"
                      enableMouseTracking={false}
                      showInLegend={false}
                    />

                    <MapBubbleSeries
                      dataLabels={{
                        enabled: true,
                        format: '{point.capital}'
                      }}
                      color={Highmaps.defaultOptions.colors[0]}
                      name="State Capitals"
                      data={populationData}
                      maxSize="30%"
                    />
                  </YAxis>

                  <MapNavigation>
                    <MapNavigation.ZoomIn />
                    <MapNavigation.ZoomOut />
                  </MapNavigation>

                  <Tooltip pointFormat='{point.capital}, {point.parentState}: <b>{point.z}</b><br/>' />

                  <Credits />

                  <Legend />
                </HighchartsMapChart>
              )
            }

            return null
          }}
        </Fetch>

      {/*   <ExampleCode name="MapBubble">{code}</ExampleCode> */}
      </div>
    )
  }
}

export default withHighmaps(App, Highmaps)