import { d3 } from '../../lib/d3-lite'

export default function (els, dataChart, area, colors) {

    // init area
    let svg = d3.select(els.svg)
        .selectAll("path")
        .data(dataChart)

    // update
    svg
        .attr("d", d => area(d))
        .attr("fill", (d, i) => colors[i])

    // new
    svg.enter().insert("path", ":first-child")
        .attr("d", d => area(d))
        .attr("fill", (d, i) => colors[i])
        .attr("fill-opacity", .75)
        .attr("shape-rendering", "auto")

    // remove
    svg.exit().remove()

    // 50% line
    if (!els.line) return
    d3.select(els.line)
        .attr("fill-opacity", 1)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
}