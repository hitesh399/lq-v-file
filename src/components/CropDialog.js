import Vue from 'vue'
import LqCrop from './LqCrop';

export default Vue.extend({
    name: 'crop-box',
    inject: ['lqFile'],
    components: {
        LqCrop
    },
    computed: {
        dialog () {
            return this.lqFile.showCropBox
        }
    },
    render(h) {
        if (!this.dialog) {
            return null;
        }
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
                        this.lqFile.popupTitle ? h('v-card-title', { class: {headline: true} }, this.lqFile.popupTitle) : null,
                        h(
                            'v-card-text',
                            [
                                h(
                                    'div',
                                    {
                                        style: {
                                            height: `${this.lqFile.popupHeight}px`
                                        }
                                    },
                                    [
                                        h(
                                            'lq-crop',
                                            {
                                                props: {
                                                    id: this.lqFile.id,
                                                    fileIndex: this.lqFile.fileIndexToCrop,
                                                    fileObject: this.lqFile.fileObjectToCrop,
                                                    viewport: this.lqFile.viewport,
                                                    size: this.lqFile.thumbSize
                                                }
                                            }
                                        )
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ]
        )
    }
})