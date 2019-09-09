import Vue from 'vue'
import LqCrop from './LqCrop';

export default Vue.extend({
    name: 'crop-box',
    inject: ['lqFile'],
    components: {
        LqCrop
    },
    data() {
        return {
            actionAreaWidth: 0
        }
    },
    computed: {
        dialog() {
            return this.lqFile.showCropBox
        },
        getViewPort() {
            let viewPort = { ...this.getBoundary }
            viewPort.width = viewPort.width - 20;
            viewPort.height = viewPort.height - 20;
            return viewPort
        },
        getBoundary() {
            let viewPort = { ...this.lqFile.viewport };
            if (viewPort.width > this.actionAreaWidth) {
                const newWidth = this.actionAreaWidth
                const aspectRatio = (this.lqFile.thumb.width / this.lqFile.thumb.height)
                const newHeight = (newWidth / aspectRatio)
                viewPort.height = newHeight
                viewPort.width = newWidth
            }
            return viewPort;
        }
    },
    updated() {
        // console.log('CardText', this.$refs.CardText.offsetWidth)
        this.actionAreaWidth = this.$refs.CardText ? this.$refs.CardText.offsetWidth : this.lqFile.thumb.width
    },
    render(h) {
        if (!this.dialog) {
            return null;
        }
        // console.log(this.getBoundary, 'Boundary')
        const self = this;
        return h(
            'v-dialog',
            {
                props: {
                    value: this.dialog,
                    persistent: this.lqFile.croppPopupPersistent,
                    width: 600,
                },
                attrs: {
                    // width: 600
                }
            },
            [
                h(
                    'v-card',
                    [
                        h(
                            'v-card-title',
                            {
                                class: { headline: true }
                            },
                            [
                                this.genToolBar()
                            ]
                        ),
                        h(
                            'v-card-text',
                            [
                                h(
                                    'div',
                                    {
                                        style: {
                                            height: `${this.lqFile.popupHeight}px`
                                        },
                                        ref: 'CardText'
                                    },
                                    [
                                        h(
                                            'lq-crop',
                                            {
                                                props: {
                                                    id: this.lqFile.id,
                                                    fileIndex: this.lqFile.fileIndexToCrop,
                                                    fileObject: this.lqFile.fileObjectToCrop,
                                                    viewport: this.getViewPort,
                                                    size: this.lqFile.thumbSize,
                                                    enableResize: this.lqFile.enableResize
                                                },
                                                attrs: {
                                                    boundary: this.getBoundary,
                                                },
                                                on: {
                                                    cropped() {
                                                        self.lqFile.onHideCropBox()
                                                    }
                                                },
                                                ref: 'cropper'
                                            }
                                        )
                                    ]
                                )
                            ]
                        ),
                        h(
                            'v-card-actions',
                            [
                                h('v-spacer'),
                                h(
                                    'v-btn',
                                    {
                                        props: {
                                            color: 'green darken-1',
                                            flat: true
                                        },
                                        on: {
                                            click(event) {
                                                event.stopPropagation()
                                                self.$refs.cropper.cropImage()
                                            }
                                        }
                                    },
                                    'Crop'
                                ),
                                this.genDeleteBtn()
                            ]
                        )
                    ]
                )
            ]
        )
    },
    methods: {
        genDeleteBtn() {
            const self = this;
            return this.$createElement(
                'v-btn',
                {
                    props: {
                        flat: true,
                        color: 'danger darken-1',
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.$emit('close', self.lqFile.fileObjectToCrop, self.lqFile.fileIndexToCrop)
                            self.lqFile.onHideCropBox(false)
                        }
                    }
                },
                'Close'
            )
        },
        genToolBar() {
            if (!this.lqFile.popupTitle) {
                return null;
            }
            return this.$createElement(
                'v-toolbar',
                {
                    props: {
                        flat: true,
                        color: '#fff'
                    }
                },
                [

                    this.genHeading(),
                ]
            )
        },
        genHeading() {
            return this.$createElement(
                'v-toolbar-title',
                this.lqFile.popupTitle
            )
        }
    }
})