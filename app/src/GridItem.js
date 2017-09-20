import React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'
import Dragger from './Dragger'

export default class GridItem extends Component {
    constructor(props) {
        super(props)
        this.onDrag = this.onDrag.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.calGridXY = this.calGridXY.bind(this)
        this.calColWidth = this.calColWidth.bind(this)
    }


    static PropTypes = {
        /**外部容器属性 */
        col: PropTypes.number,
        containerWidth: PropTypes.number,
        containerPadding: PropTypes.array,

        /**子元素的属性 */
        margin: PropTypes.array,
        GridX: PropTypes.number,
        GridY: PropTypes.number,
        rowHeight: PropTypes.number,

        /**子元素的宽高 */
        w: PropTypes.number,
        h: PropTypes.number,

        /**生命周期回掉函数 */
        onDragStart: PropTypes.func,
        onDragEnd: PropTypes.func

    }

    static defaultProps = {
        col: 6,
        containerWidth: 500,
        containerPadding: [0, 0],
        margin: [10, 10],
        rowHeight: 30,
        w: 1,
        h: 1
    }

    /** 计算容器的每一个格子多大 */
    calColWidth() {
        const { containerWidth, col, containerPadding, margin } = this.props
        return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col
    }

    /**转化，计算网格的GridX,GridY值 */
    calGridXY(x, y) {
        const { margin, containerWidth, col, w } = this.props

        /**坐标转换成格子的时候，无须计算margin */
        let GridX = Math.round(x / containerWidth * col)
        let GridY = Math.round(y / (this.props.rowHeight + margin[1]))

        /**防止元素出container */
        if (GridX + w > col - 1) GridX = col - w
        if (GridX < 0) GridX = 0
        if (GridY < 0) GridY = 0

        return { GridX, GridY }
    }

    /**给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px */
    calGridItemPosition(GridX, GridY) {
        const { w, margin, col, containerWidth } = this.props



        let x = Math.round(GridX * (containerWidth - margin[0] * (col + 1)) / col + (GridX + 1) * margin[0])
        let y = Math.round(GridY * this.props.rowHeight + margin[1] * (GridY + 1))
        return {
            x: x,
            y: y
        }
    }

    /**宽和高计算成为px */
    calWHtoPx(w, h) {
        const { margin, containerPadding, containerWidth, col } = this.props

        const wPx = Math.round(w * this.calColWidth() + (w - 1) * margin[0])
        const hPx = Math.round(h * this.props.rowHeight + (h - 1) * margin[1])

        return { wPx, hPx }
    }

    onDragStart(x, y) {
        const { w, h, index } = this.props
        const { GridX, GridY } = this.calGridXY(x, y)

        this.props.onDragStart({
            event, GridX, GridY, w, h, index
        })
    }
    onDrag(event, x, y) {
        let { GridX, GridY } = this.calGridXY(x, y)
        const { w, h, col } = this.props

        this.props.onDrag({ GridX, GridY, w, h }, this.props.index)
    }

    onDragEnd() {
        if (this.props.onDragEnd) this.props.onDragEnd(this.props.index)
    }

    render() {
        const { x, y } = this.calGridItemPosition(this.props.GridX, this.props.GridY)
        const { w, h, margin, style, bounds } = this.props
        const { wPx, hPx } = this.calWHtoPx(w, h)

        return (
            <Dragger
                style={{
                    ...style, width: wPx, height: hPx, position: 'absolute',
                    transition: this.props.isUserMove ? '' : 'all .15s'
                }}
                onDragStart={this.onDragStart}
                onMove={this.onDrag}
                onDragEnd={this.onDragEnd}
                x={x}
                y={y}
                isUserMove={this.props.isUserMove}
            >
                <div >
                    {React.Children.map(this.props.children, (child) => child)}
                </div>
            </Dragger>
        )
    }
}