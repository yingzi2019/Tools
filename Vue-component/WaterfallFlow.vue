<template>
    <div
        ref="flowWrap"
        class="m-flow"
        :style="`height: ${maxTop}px`"
    >
        <div
            v-for="(item, index) in items"
            :key="item + index"
            ref="flowItem"
            class="u-flow-item"
        >
            <el-image
                class="u-card-image"
                v-if="item.img"
                :src="item.img"
                lazy
            >
            </el-image>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WaterfallFlow',
    props: {
        items: {
            type: Object || Array,
            default: () => ({})
        }
    },
    data () {
        return {
            flowData: {
                itemWidth: 300,
                columnNumber: null,
                topList: [],
            },
            lastIndex: 0
        }
    },
    computed: {
        maxTop () {
            return Math.max.apply(null, this.flowData.topList)
        }
    },
    methods: {
        initLayout () {
            const containerWidth = this.$refs.flowWrap.clientWidth;
            this.flowData.columnNumber = Math.round(containerWidth / this.flowData.itemWidth);
        },

        getPosition (item) {
            const topValue = this.maxTop;
            const index = this.flowData.indexOf(topValue);
            this.flowData.topList[index] = item.clientHeight + top;

            return [`${top}px`, `${this.flowData.itemWidth * index}px`]
        },

        changeLayout () {
            if (this.items.length === this.lastIndex) return false;

            this.$nextTick(() => {
                const items = this.$refs.flowItem.filter((item, index) => {
                        if (index >= this.lastIndex) return true
                    }).map(item => item.$el);

                if (this.lastIndex === 0 && this.lastIndex < this.flowData.columnNumber) {
                    for (const item of items.slice(0, this.flowData.columnNumber)) {
                        this.flowData.topList.push(item.clientHeight);
                        item.style.top = '0px';
                        item.style.left = `${this.flowData.itemWidth * this.lastIndex}px`;
                        this.lastIndex += 1;
                    }
                }

                for (const item of items.slice(this.lastIndex)) {
                    [item.style.top, item.style.left] = this.getPosition(item);
                }

                this.lastIndex = this.articleList.length;
            });
        }
    },
    
    watch: {
        'items.length': () => this.changeLayout(),
    }
}
</script>

<style>

</style>