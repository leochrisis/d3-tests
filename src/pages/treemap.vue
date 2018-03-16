<template>
  <svg width="500" height="270">
    <g style="transform: translate(0, 10px)">

    </g>
  </svg>
</template>

<script type="text/javascript">
import * as d3 from 'd3'

export default{
  name: 'Treemap',

  data: () => ({
    color: {},
    jsonData: null,
    rootNode: {},
    margin: {
      top: 20,
      right: 0,
      bottom: 0,
      left: 0
    },
    width: 500,
    height: 270
  }),

  mounted () {
    var that = this
    that.color = d3.scaleOrdinal(d3.schemeCategory20)
    d3.json('../static/flare.json',
      function (error, data) {
        if (error) console.log(error)
        console.log(data)
        that.jsonData = data
        that.initialize()
        that.accumulate(that.rootNode, that)
        that.treemap(that.rootNode)
      }
    )
  },

  computed: {
    parentId () {
      if (this.selectedNode.parent === undefined || this.selectedNode.parent === null) {
        return this.selectedNode.id
      } else {
        return this.selectedNode.parent.id
      }
    },

    treemap () {
      return d3.treemap()
      .size([this.width, this.height])
      .round(false)
      .paddingInner(0)
    },

    x () {
      return d3.scaleLinear()
        .domain([0, this.width])
        .range([0, this.width])
    },

    y () {
      return d3.scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },
  },

  methods: {
    initialize () {
      let that = this

      if (that.jsonData) {
        that.rootNode = d3.hierarchy(that.jsonData)
        .eachBefore(function (d) { d.id = (d.parent ? d.parent.id + '.' : '') + d.data.name })
        .sum((d) => d.value)
        .sort(function (a, b) {
          return b.height - a.height || b.value - a.value
        })
        that.rootNode.x = that.rootNode.y = 0
        that.rootNode.x1 = that.width
        that.rootNode.y1 = that.height
        that.rootNode.depth = 0
      }
    },

    accumulate (d, context) {
      d._children = d.children
      if (d._children) {
        d.value = d._children.reduce(function (p, v) { return p + context.accumulate(v, context) }, 0)
        return d.value
      } else {
        return d.value
      }
    }
  }
}
</script>
