import Vue from 'vue'
import {lqFileMixin, lqPermissionMixin, lqElementMixin} from 'lq-form';
import  helper from 'vuejs-object-helper';
import FileItem from './LqVFileItem'
import CropDialog from './CropDialog'

export default Vue.extend({
    name: 'lq-v-file',
    mixins: [lqElementMixin, lqPermissionMixin, lqFileMixin],
    components: {
        FileItem,
        CropDialog
    },
    provide() {
		return {
			lqFile: this
		};
	},
    props: {
        boxHeight: Number,
        croppPopupPersistent: {
            type: Boolean,
            default: () => true
        },
        popupHeight: {
            type: Number,
            default: () => 300
        },
        multiple: {
            type: Boolean,
            default: () => false
        },
        valueKey: {
            type: String,
            default: () => 'path'
        },
        circle: {
            type: Boolean,
            default: () => false
        },
        thumb: {
            type: Object,
            required: false
        },
        showSelector: {
            type: Boolean,
            default: () => true
        },
        popupTitle: String,
        aspectRatio: {
            type: Number,
            default: () => 1
        },
        thumbSize: {
            type: [String, Object],
            default: () => 'original'
        },
        flexProps: {
            type: Object,
            default: () => {
                return {'xs12': true, 'md12': true }
            }
        }
    },
    data () {
        return {
            openBrowser: false,
            showCropBox: false,
            fileObjectToCrop: null,
            fileIndexToCrop: null
        }
    },
    computed: {
        showAddBtn: function() {
            if (!this.multiple && (!this.fileObject || !this.fileObject.id || !this.fileObject.uid) ) {
                return this.fileObject && (this.fileObject.id || this.fileObject.uid) ? false : true;
            } else if (this.multiple && (!this.maxNoOfFiles ||  this.fileObject.length < this.maxNoOfFiles)) {
                return true;
            } else {
                return false;
            }
        },
        maxNoOfFiles: function () {
            return this.$helper.getProp(this.lqElRules, 'file.max');
        },
        fileObject: function () {
            return helper.getProp(
                this.$store.state.form, 
                `${this.formName}.values.${this.id}`,
                this.multiple ? [] : null
            );
        },
        viewport: function () {
            if (!this.thumb) {
              return false;
            }
            if (this.popupHeight <= this.thumb.height) {
                let newHeight  = (this.popupHeight - 20);
                let newWidth = this.thumb.width/this.thumb.height * newHeight
                return {
                  width: newWidth,
                  height: newHeight
                }
            }
            return this.lqFile.thumb;
          },
    },
    render (h) {
        const items = [
            this.showAddBtn ? this.renderDefaultSlot() : null
        ].concat(this.renderItems())

        return h(
            'div', 
            {
                class: {
                    'has-errors': this.errors && this.errors.length ? true : false 
                }
            },
            [
                this.genInputFile(),
                this.$createElement(
                    'v-container', 
                    {
                        gridListMd: true,
                        textXsCenter: true
                    },
                    [
                        this.$createElement(
                            'v-layout',
                            {
                                props: {
                                    row: true,
                                    wrap: true
                                }
                            },
                            items
                        ),
                        h('crop-dialog')
                    ]
                )
            ]
        )
    },
    methods: {
        renderDefaultSlot() {
            if (this.$scopedSlots.default) {
                return this.$scopedSlots.default(
                    { 
                        openWindow: this.handleClick, 
                        disabled: this.disabled,
                        errors: this.errors
                    }
                )
            }
            return this.genItemContainer([this.genDefaultSelector()])
        },
        renderItems() {
            if (this.showAddBtn) {return [null]}
            if (!this.multiple) {
                return [this.genItemContainer([this.genFileItem(this.fileObject, undefined)])];
            } else {
                return this.fileObject.map( (file, index) => {
                    return [this.genItemContainer([this.genFileItem(file, index)])]
                })
            }
        },
        genInputFile () {
            return this.$createElement(
                'input',
                {
                    attrs: {
                        id: `${this.formName}_${this.id}`,
                        name: this.id,
                        type: 'file',
                        multiple: this.multiple,
                    },
                    style: {
                        display: 'none'
                    },
                    on: {
                        click: this.clickOnInputFile,
                        change: this.fileChanged
                    },
                    ref: 'input'
                }
            )
        },
        genDefaultSelector() {
            return this.$createElement(
                'div', 
                {
                    style: {
                        height: `${(this.boxHeight ? this.boxHeight : 100)}px`,
                        cursor: !this.disabled ? 'pointer' : 'inherit'
                    },
                    class: {
                        item: true,
                        'elevation-5': true
                    },
                    on: {
                        click: this.handleClick
                    },
                },
                [
                    this.$createElement(
                        'v-layout', 
                        {
                            alignCenter: true,
                            justifyCenter: true,
                            row: true,
                            fillHeight: true
                        },
                        [
                            this.$createElement('v-icon', 'fa-plus')
                        ]
                    )
                ]
            )
        },
        genItemContainer(content) {
            return this.$createElement(
                'v-flex', 
                {
                    attrs: this.flexProps
                }, 
                content
            )
        },
        genFileItem (fileObject, fileIndex) {
            return this.$createElement(
                'file-item',
                {
                    props: {
                        fileObject,
                        fileIndex
                    },
                    on: {
                        delete: this.deleteFile,
                        change: this.handleClick,
                        showCropper: this.onShowCropBox
                    }
                }
            )
        },
        fileChanged (event) {
            this.handleFileChange(event);
            this.openBrowser = false;
        },
        formatter () {
            let fileObject  = !this.multiple && this.fileObject ? [this.fileObject] : this.fileObject;
            if (!fileObject) return
            let outPut = fileObject.map( f => {
              return {
                file: f.file ? f.file : '',
                id: f.id ? f.id : '',
              }
            });
            return !this.multiple && outPut ? outPut[0] : outPut;
        },
        clickOnInputFile () {
            document.body.onfocus = this.checkIt;
        },
        checkIt () {
            if (!this.$refs.input.value.length) { 
                document.body.onfocus = null;
                this.openBrowser = false;
            }
        },
        cropped (fileObject, fileindex) {
            this.$emit('cropped', fileObject, fileindex);
        },
        onShowCropBox (fileObject, fileIndex) {
            this.showCropBox = true;
            this.fileIndexToCrop = fileIndex;
            this.fileObjectToCrop = fileObject;
        },
        onHideCropBox () {
            this.showCropBox = false;
            this.fileIndexToCrop = null;
            this.fileObjectToCrop = null;
        },
        handleClick() {
            // console.log('Tets I am calling..')
            if (!this.disabled) {
                this.openBrowser = true;
                this.$refs.input.value = null;
                this.$refs.input.click();
            }
        },
        deleteFile (file) {
            if (!this.multiple) {
              this.setValue(null);        
            } else {
              this.fileObject.every( (f, index) => {
                  if ( (f.id && f.id === file.id) || f.uid === file.uid) {
                    this.remove(this.id + '.' + index);
                    return;
                  } else {
                    return true;
                  }
              });
            }
            this.validate();
          }
    },
    created () {
        this.$lqForm.addProp(this.formName, this.id, 'formatter', this.formatter)
    },
})