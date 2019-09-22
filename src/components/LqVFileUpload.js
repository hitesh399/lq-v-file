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
                        'open-cropper': this.onShowCropBox
                    }
                }
            )
        },
    }
})