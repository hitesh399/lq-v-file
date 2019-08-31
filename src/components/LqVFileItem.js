import Vue from 'vue'
import  helper, { isImage } from 'vuejs-object-helper';

export default Vue.extend({
    name: 'lq-file-item',
    inject: ['lqForm', 'lqFile'],
    provide() {
        return {
            lqFileItem: this
        };
    },
    props: {
        fileObject: {
            type: Object,
            required: true
        },
        showChange: {
            type: Boolean,
            default: () => true
        },
        fileIndex: Number
    },
    data () {
        return {
            showCropBox: false,
            loading: false,
            isImage: false,
            imageRawData: '',
            hover: false,
            uploadedFileType: null
        }
    },
    
    computed: {
        boxHeight() {
            return this.lqFile.boxHeight ? this.lqFile.boxHeight : 100;
        },
        errors () {
            let fileId = this.fileIndex ? `${this.lqFile.id}.${this.fileIndex}` : this.lqFile.id
            let fileObjectPath = [ this.lqForm.name, 'errors', fileId ]
            let filePath = [ this.lqForm.name, 'errors', fileId, 'file' ]
            const fileObjectError = this.$helper.getProp(
                this.$store.state.form,
                fileObjectPath,
                null
            )
            const fileError = this.$helper.getProp(
                this.$store.state.form,
                filePath,
                null
            )
            const error1 = helper.isArray(fileObjectError) ? fileObjectError : [];
            const error2 = helper.isArray(fileError) ? fileError : [];
            const errors = error1.concat(error2)
            return errors.length ? errors[0] : null;
        },
        isCropped: function () {
            return helper.getProp(this.fileObject, 'cropped', null);
          },
          originalFile: function () {
            return helper.getProp(this.fileObject, 'original', null);
          },
          file: function () {
            return this.fileObject ? this.fileObject.file : null;
          },
          isBlank: function () {
            return !(this.file || this.uploadedFileUrl)
          },
          uploadedFileUrl: function () {
            return helper.getProp(this.fileObject, this.lqFile.valueKey, null);
          },
          previewImage: function () {
            return this.imageRawData ? this.imageRawData : (this.uploadedFileUrl ? this.uploadedFileUrl : '')
          },
          viewport: function () {
            if (!this.lqFile.thumb) {
              return false;
            }
            if (this.lqFile.popupHeight <= this.lqFile.thumb.height) {
                let newHeight  = (this.lqFile.popupHeight - 20);
                let newWidth = this.lqFile.thumb.width/this.lqFile.thumb.height * newHeight
                return {
                  width: newWidth,
                  height: newHeight
                }
            }
            return this.lqFile.thumb;
          }
    },
    created: function (){
        this.readFile();
        this.findUploadedFileType(this.uploadedFileUrl);
    },
    render(h) {
        if (this.isBlank) return;
        console.log('I am here sjgdhs 1')
        const self = this;
        return h(
            'div',
            {
                class: {
                    item: true,
                    'elevation-5': true,
                    'is-error': !!this.errors
                },
                style: {
                    height: `${(this.boxHeight ? this.boxHeight : 100)}px`,
                    cursor: this.isBlank ? 'pointer' : 'inherit'
                }
            },
            [
                this.$createElement(
                    'v-hover',
                    {
                        scopedSlots: {
                            default: function ({ hover }) {
                                console.log('I am adjhsjdgsjgdjs 21')
                                return self.genImageItem(hover)
                            }
                        }
                    }
                )
            ]
        )
    },
    methods: {
        genImageItem (hover) {
            console.log('I am here to do some...')
            return this.$createElement(
                'v-img',
                {
                    props: {
                        src: this.previewImage,
                        aspectRatio: this.lqFile.aspectRatio,
                        class: {
                            grey: true,
                            'lighten-2': true 
                        }
                    }
                },
                [
                    this.$createElement(
                        'v-expand-transition',
                        [
                            this.$createElement(
                                'div',
                                [ this.lqFile.openBrowser === false && hover ? this.genHoverItem() : null]
                            )
                        ]
                    )
                ]
            )
        },
        genHoverItem () {
            console.log('I am mouse hover Item here')
            return this.$createElement(
                'div',
                {
                    class: {
                        'd-flex': true,
                        'transition-fast-in-fast-out': true,
                        'backdrop': true,
                        'fill-height': true
                    },
                    attrs: {
                        title: this.errors
                    }
                },
                [
                    this.$createElement(
                        'v-layout',
                        {
                            props: {
                                alignCenter: true,
                                justifyCenter: true,
                                column: true
                            }
                        },
                        [
                            this.genDeleteBtn(),
                            this.genChangeBtn(),
                            this.genCropBtn(),
                        ]
                    )
                ]
            )
        },
        genDeleteBtn () {
            const self = this;
            return this.$createElement(
                'v-btn',
                {
                    props: {
                        icon: true,
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.$emit('delete', self.fileObject, self.fileIndex)
                        }
                    }
                },
                [
                    // this.$createElement('v-icon', 'fa-trash')
                    'Delete'
                ]
            )
        },
        genChangeBtn () {
            const self = this;
            return this.$createElement(
                'v-btn',
                {
                    props: {
                        icon: true,
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.$emit('change', self.fileObject, self.fileIndex)
                        }
                    }
                },
                [
                    // this.$createElement('v-icon', 'fa-file')
                    'Change'
                ]
            )
        },
        genCropBtn () {
            const self = this;
            if (!(this.isImage && this.file && this.lqFile.thumb)) {
                return
            }
            return this.$createElement(
                'v-btn',
                {
                    props: {
                        icon: true,
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            // self.showCropBox = true;
                            self.$emit('showCropper', this.fileObject, this.fileIndex)
                        }
                    }
                },
                [
                    // this.$createElement('v-icon', 'fa-crop')
                    'Crop'
                ]
            )
        },
        readFile() {
            if (!this.file) {
            return;
            }
            let fReader = new FileReader();
            this.loading = true;
            fReader.onload = (e) => {
                this.isImage  =  isImage(e.target.result) ? true : false;
                if (this.isImage && !this.isCropped && this.lqFile.thumb && this.fileIndex === undefined) {
                    this.$emit('showCropper', this.fileObject, this.fileIndex)
                }
                this.loading = false;
                this.imageRawData = e.target.result;
            }
            fReader.readAsDataURL(this.file);
        },
        findUploadedFileType(url) {
            if (!url) {
                this.uploadedFileType = null;
                return;
            }

            var img = new Image();
            img.onload = (e) => {
            if (e.type === 'load') {
                this.uploadedFileType = 'image'
            } else {
                this.uploadedFileType = 'file'
            }
            }
            img.src = url;
        }
    },
    watch: {
        fileObject: function (newFile, oldFile) {
          !oldFile || !newFile || newFile.uid !==  oldFile.uid ? this.readFile() : null;
        },
        uploadedFileUrl: function (newUrl, oldUrl) {
          this.findUploadedFileType(newUrl);
        }
    },
})