import Vue from 'vue'
import  helper, { isImage } from 'vuejs-object-helper';
import { EventBus } from 'lq-form'

export default Vue.extend({
    name: 'lq-file-item',
    inject: ['lqForm', 'lqFile'],
    provide() {
        return {
            lqFileItem: this
        };
    },
    props: {
        hideDetails: {
            type: Boolean,
            default: () => false
        },
        fileIndex: Number
    },
    data () {
        return {
            loading: false,
            isImage: false,
            imageRawData: '',
            hover: false,
            errorRules: [],
            uploadedFileType: null
        }
    },
    
    computed: {
        fileObject: function () {
            return helper.getProp(
                this.$store.state.form, 
                `${this.lqFile.formName}.values.${this.fileId}`,
                {}
            );
        },
        boxHeight() {
            return this.lqFile.boxHeight ? this.lqFile.boxHeight : 100;
        },
        fileId () {
            return this.fileIndex !== undefined ? `${this.lqFile.id}.${this.fileIndex}` : this.lqFile.id
        },
        fileName () {
           return this.file ? this.file.name : this.uploadedFileUrl.substring(this.uploadedFileUrl.lastIndexOf('/') +1 )
        },
        error () {
            let fileId = this.fileId
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
        uuid: function () {      
            return helper.getProp(this.fileObject, 'uid', null);
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
    render(h) {
        if (this.isBlank) return;
        const self = this;
        return h(
            'div',
            {
                class: {
                    item: true,
                    'elevation-5': true,
                    'is-error': !!this.error,
                    ['unique-' + this.uuid] : true
                },
                style: {
                    'min-height': `${(this.boxHeight ? this.boxHeight : 100)}px`,
                    cursor: this.isBlank ? 'pointer' : 'inherit',
                    position: 'relative'
                }
            },
            [
                this.$createElement(
                    'v-layout', 
                    {
                        attrs: {
                            'align-center': true,
                            'justify-center': true,
                            row: true,
                            'fill-height': true,
                            wrap: true
                        },
                        style: {
                            margin: 0
                        },
                    },
                    [
                        this.$createElement(
                            'v-hover',
                            {
                                scopedSlots: {
                                    default: function ({ hover }) {
                                        return self.isImage || self.uploadedFileType === 'image' ?  self.genImageItem(hover) : self.genFileItem(hover)
                                    }
                                }
                            }
                        ),
                        // self.isImage || self.uploadedFileType === 'image' ?  self.genImageItem(true) : self.genFileItem(true),
                        this.genMessages()
                    ]
                )
            ]
        )
    },
    methods: {
        genImageItem (hover) {
            return this.$createElement(
                'v-img',
                {
                    props: {
                        src: this.previewImage,
                        aspectRatio: this.lqFile.thumb ? this.lqFile.thumb.width/this.lqFile.thumb.height : this.lqFile.aspectRatio,
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
                            this.lqFile.openBrowser === false && hover ? this.genHoverItem() : null
                        ]
                    )
                ]
            )
        },
        genFileItem(hover) {
            return this.$createElement(
                'div',
                {
                    class: {
                        // 'text-truncate' : true
                    },
                    style: {
                        width: '100%',
                        padding: '10px',
                        'word-break': 'break-all'
                    }
                },
                [
                    this.$createElement(
                        'div',
                        [
                            this.$createElement(
                                'span',
                                {
                                    class: {
                                        // 'text-truncate' : true
                                    }
                                },
                                this.fileName
                            ),
                            this.$createElement(
                                'v-expand-transition',
                                [
                                    this.lqFile.openBrowser === false && hover ? this.genHoverItem() : null
                                ]
                            )
                        ]
                    )
                ]
            )
        },
        genHoverItem () {
            return this.$createElement(
                'v-layout',
                {
                    class: {
                        'transition-fast-in-fast-out': true,
                        'backdrop': true,
                    },
                    style: {
                        margin: 0,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%'
                    },
                    attrs: {
                        'align-center': true,
                        'justify-center': true,
                        column: true,
                        'fill-height': true,
                        wrap: true
                    }
                },
                [
                    this.genDeleteBtn(),
                    !this.lqFile.multiple ? this.genChangeBtn() : null,
                    this.genCropBtn(),
                    this.genViewBtn(),
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
                    this.$createElement('v-icon', 
                        {
                            attrs: {
                                title: this.lqFile.deleteIconTitle
                            }
                        },
                        this.lqFile.deleteIcon
                    )
                ]
            )
        },
        genMessages () {
            if (this.hideDetails) return null
            if (this.error) {
                return this.$createElement(
                    'v-messages',
                    {
                        props: {
                            value: [this.error], 
                            color: 'error' 
                        }
                    }
                )
            }
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
                            self.$emit('open-window', self.fileObject, self.fileIndex)
                        }
                    }
                },
                [
                    this.$createElement(
                        'v-icon', 
                        {
                            attrs: {
                                title: self.lqFile.changeIconTitle
                            },
                        },
                        this.lqFile.changeIcon
                    )
                ]
            )
        },
        genViewBtn () {
            if (!this.lqFile.showViewBtn) {
                return;
            }
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
                            const file = self.file;
                            if (file) {
                                const fileURL = URL.createObjectURL(file);
                                window.open(fileURL, '_blank');
                            } else {
                                window.open(self.uploadedFileUrl, '_blank');
                            }
                        }
                    }
                },
                [
                    this.$createElement(
                        'v-icon', 
                        {
                            attrs: {
                                title: self.lqFile.viewIconTitle
                            },
                        },
                        this.lqFile.viewIcon
                    )
                ]
            )
        },
        genCropBtn () {
            if (!this.canShowCropper()) {return}
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
                            self.$emit('open-cropper', self.fileObject, self.fileIndex)
                        }
                    }
                },
                [
                    this.$createElement(
                        'v-icon', 
                        {
                            attrs: {
                                title: self.lqFile.cropIconTitle
                            },
                        },
                        this.lqFile.cropIcon
                    )
                ]
            )
        },
        readFile(showCroped = true) {
            if (!this.file) {
                this.imageRawData = null;
                this.uploadedFileType = 'file';
                this.isImage = false;
                this.findUploadedFileType(this.uploadedFileUrl)
                return;
            }
            let fReader = new FileReader();
            this.loading = true;
            fReader.onload = (e) => {
                this.isImage  =  isImage(e.target.result) ? true : false;
                // console.log('I am sjdgsjhgdhjsd T1', this.isImage, this.isCropped, showCroped , this.lqFile.thumb)
                if (showCroped && this.isImage && !this.isCropped && this.lqFile.thumb && this.fileIndex === undefined) {

                    if (!this.lqFile.lqElRules) {
                        this.$emit('open-cropper', this.fileObject, this.fileIndex)
                    }
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
        },
        whenFileValidated (errors, error_in_rules) {
            this.errorRules = error_in_rules;
            if (this.canShowCropper() && !this.isCropped) {
                this.$emit('open-cropper', this.fileObject, this.fileIndex)
            }
        },
        canShowCropper() {
            if (
                !this.errorRules || 
                this.errorRules.length === 0 || 
                (this.errorRules.length === 1 && this.errorRules[0] === 'file:crop') 
            ) {
                return true;
            }
            return false;
        }
    },
    created () {
        EventBus.$on('lq-element-validated-' + this.lqForm.formName + '-' + this.fileId, this.whenFileValidated)
    },
    beforeDestroy () {
        EventBus.$off('lq-element-validated-' + this.lqForm.formName + '-' + this.fileId, this.whenFileValidated)
    },
    watch: {
        uuid:{
            handler: function (newUid, olduid) {
                if (newUid !== olduid) {
                    this.readFile()
                }
            },
            deep: true,
            immediate: true
        },
        uploadedFileUrl: {
            handler: function (newUrl) {
                this.findUploadedFileType(newUrl);
            },
            immediate: true
        }
    },
})