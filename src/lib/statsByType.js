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
        break;

        case "lineDiscrete":
        return ["min", "max", "roi"];
        break;

        case "plotDot":
        return ["median", "min", "max"];
        break;

        case "plotScatter":
        return ["median", "mean", "min", "max", "percentile2", "percentile98"];
        break;

        case "col":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "colGroup":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "colGroupStack":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "colGroupStack100":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "areaGroupStack":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "areaGroupStack100":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "slopegraph":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "bar100":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "brokenBar100":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "barGroupStack100":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "onBarTicks":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "onBarDiffDots":
        return ["median", "mean", "percentile2", "percentile98"];
        break;

        case "onBarDiffArrow":
        return ["median", "mean", "percentile2", "percentile98"];
        break;


        default:
        return ["median", "mean", "percentile2", "percentile98"];
        break; 
    }

}