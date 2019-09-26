import LqVFile from './LqVFile'
import LqVFileUploadItem from './LqVFileUploadItem'

export default LqVFile.extend({
    name: 'lq-v-file-upload',
    components: { LqVFileUploadItem },
    provide() {
        return {
            lqFileUpload: this
        };
    },
    props: {
        action: {
            type: String,
            required: true
        },
        tokenAction: String,
        fileName: {
            type: String,
            default: () => 'file'
        }
    },
    data() {
        return {

            fileItems: []
        }
    },
    computed: {
        topBottomScope() {
            return {
                openWindow: this.handleClick,
                uploadFnc: this.startUploading,
                totalItems: this.totalItems,
                processItems: this.processItems,
            }
        },
        totalItems() {
            return this.fileItems.filter(v => v.file).length
        },
        processItems() {
            return this.fileItems.filter(v => v.uploading).length
        }
    },
    methods: {
        genFileItem(fileIndex) {
            return this.$createElement(
                'lq-v-file-upload-item',
                {
                    props: {
                        fileIndex,
                        hideDetails: this.hideItemError
                    },
                    on: {
                        delete: (file, index) => {
                            this.onFileDelete(file, index)
                        },
                        'open-window': this.handleClick,
                        'open-cropper': this.onShowCropBox,
                        'upload-completed': () => { this.$emit('upload-completed') }
                    },
                    scopedSlots: {
                        items: this.$scopedSlots.items,
                        uploading: this.$scopedSlots.uploading
                    }
                }
            )
        },
        startUploading() {
            this.fileItems.forEach(v => v.uploadFile())
        },
        
    }
})