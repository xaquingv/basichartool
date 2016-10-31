import {d3} from '../../lib/d3-lite'
import * as topojson from "topojson";
import world from '../../assets/data/world'
import lakes from '../../assets/data/lakes'
import borders from '../../assets/data/borders'


const width = 320;
const height = 320*0.6;

export let projection =
  d3.geoKavrayskiy7()
  .scale(60)
  // TODO: adjust translate
  .translate([(width / 2)-20, (height / 2)+15])

export let path =
  d3.geoPath()
  .projection(projection);

export let featureCountries =
  topojson.feature(world, world.objects.countries).features;
//console.log(featureCountries)

export function drawMap(els) {

  d3.select(els.countries)
  .attr("class", "countries")
  .selectAll("path")
  .data(featureCountries)
  .enter().append("path")
  .attr("d", path)
  .attr("fill", () => "#dcdcdc") //n-4

  d3.select(els.borders)
  .attr("class", "borders")
  .selectAll("path")
  .data(topojson.feature(borders, borders.objects.boundary).features)
  .enter().append("path")
  .attr("d", path)
  .attr("fill", "transparent")
  .attr("stroke", "white")
  .attr("stroke-width", 0.5)

  d3.select(els.lakes)
  .attr("class", "lakes")
  .selectAll("path")
  .data(topojson.feature(lakes, lakes.objects.lakes).features)
  .enter().append("path")
  .attr("d", path)
  .attr("fill", "white")
}
