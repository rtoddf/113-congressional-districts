import React, {Component} from 'react';
// import queue from 'queue';
// import topojson from 'topojson';
// import all of topojson?????
import * as topojson from 'topojson';
import * as d3 from 'd3';

class CongressionalDistricts extends Component {
    state = {
        usData: null,
        usCongress: null
    }

    componentDidMount() {
        // d3.queue()
        // queue has been changed in v5. now uses promises
        // https://stackoverflow.com/questions/49534470/d3-js-v5-promise-all-replaced-d3-queue
        //     .defer(d3.json, "https://bl.ocks.org/mbostock/raw/4090846/us.json")
        //     .defer(d3.json, "https://bl.ocks.org/mbostock/raw/4090846/us-congress-113.json")
        //         .await((usData, usCongress) => {
        //             console.log(usData, usCongress)
        //         });

        // var files = ['data/us.json', 'data/us-congress-113.json'];
        // var promises = [];

        Promise.all([
            d3.json('data/us.json'),
            d3.json('data/us-congress-113.json')
            ]).then( ([usData, usCongress]) => {
                
                this.setState({
                    usData, usCongress
                })

                console.log(usData, usCongress);
            }).catch(err => console.log('Error loading or parsing data.'))
    }

    componentDidUpdate() {
        const svg = d3.select(this.refs.anchor),
            { width, height } = this.props;

        const projection = d3.geoAlbers()
            .scale(1280)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath(projection);

        const us = this.state.usData,
            congress = this.state.usCongress;

        svg.append("defs").append("path")
            .attr("id", "land")
            .datum(topojson.feature(us, us.objects.land))
            .attr("d", path);

        svg.append("clipPath")
            .attr("id", "clip-land")
            .append("use")
            .attr("xlink:href", "#land");

        svg.append("g")
            .attr("class", "districts")
            .attr("clip-path", "url(#clip-land)")
            .selectAll("path")
            .data(topojson.feature(congress, congress.objects.districts).features)
            .enter().append("path")
            .attr("d", path)
            .append("title")
            .text(function(d) { return d.id; });

        svg.append("path")
            .attr("class", "district-boundaries")
            .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
            .attr("d", path);

        svg.append("path")
            .attr("class", "state-boundaries")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("d", path);
    }

    render() {
        const { usData, usCongress }  = this.state;

        if(!usData || !usCongress) {
            return null
        } 
        
        return <g ref="anchor" />;
    }
}

export default CongressionalDistricts;