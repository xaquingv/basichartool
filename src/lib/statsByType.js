export function statsByType(id) {

    /** 
    /id/ can be any of the chart types
        -lineContinue
        -lineDiscrete
        -plotDot
        -plotScatter
        -col
        -colGroup
        -colGroupStack
        -colGroupStack100
        -areaGroupStack
        -areaGroupStack100
        -slopegraph
        -bar100
        -brokenBar100
        -barGroupStack100
        -onBarTicks
        -onBarDiffDots
        -onBarDiffArrow
    */

    switch (id) {
        case "lineContinue":
        return ["min", "max", "roi"];

        case "lineDiscrete":
        return ["min", "max", "roi"];

        case "plotDot":
        return ["median", "min", "max"];

        case "plotScatter":
        return ["median", "mean", "min", "max", "percentile2", "percentile98"];

        case "col":
        return ["median", "mean", "percentile2", "percentile98"];

        case "colGroup":
        return ["median", "mean", "percentile2", "percentile98"];

        case "colGroupStack":
        return ["median", "mean", "percentile2", "percentile98"];

        case "colGroupStack100":
        return ["median", "mean", "percentile2", "percentile98"];

        case "areaGroupStack":
        return ["median", "mean", "percentile2", "percentile98"];

        case "areaGroupStack100":
        return ["median", "mean", "percentile2", "percentile98"];

        case "slopegraph":
        return ["median", "mean", "percentile2", "percentile98"];

        case "bar100":
        return ["median", "mean", "percentile2", "percentile98"];

        case "brokenBar100":
        return ["median", "mean", "percentile2", "percentile98"];

        case "barGroupStack100":
        return ["median", "mean", "percentile2", "percentile98"];

        case "onBarTicks":
        return ["median", "mean", "percentile2", "percentile98"];

        case "onBarDiffDots":
        return ["median", "mean", "percentile2", "percentile98"];

        case "onBarDiffArrow":
        return ["median", "mean", "percentile2", "percentile98"];

        default:
        return ["median", "mean", "percentile2", "percentile98"];
    }
}