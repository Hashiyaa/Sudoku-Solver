// @ts-check

// AKA the minimum-cost s-t path
function getShortestPath(source, sink) {
    
}

class Vertex {
    constructor(capacity=0, flow=0, neighbor=null, nextVertex=null, residualCapacity=0) {
        this.capacity = capacity;
        this.flow = flow;
        this.neighbor = neighbor;
        this.nextVertex = nextVertex;
        this.residualCapacity = residualCapacity;
    }
}

class Edge {
    constructor(source, sink, capacity, cost) {
        this.source = source;
        this.sink = sink;
        this.capacity = capacity;
        this.cost = cost;
    }
}

class NetworkFlow {

    constructor() {

    }

}