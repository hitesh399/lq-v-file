import Vue from 'vue'
import {lqFileMixin, lqPermissionMixin, lqElementMixin} from 'lq-form';
import  helper from 'vuejs-object-helper';
import FileItem from './LqVFileItem'
import CropDialog from './CropDialog'
import validate from 'validate.js'

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
        },
        itemLocation: {
            type: String,
            default: () => 'prepend'
        },
        hideDetails: {
            type: Boolean,
            default: () => false
        },
        hideItemError: {
            type: Boolean,
            default: () => false
        },
        errorCount: {
            type: Number,
            default: () => 1
        },
        enableResize: {
            type: Boolean,
            default: () => false
        },
        showSelectedFile: {
            type: Boolean,
            default: () => true
        },
        deleteIcon: {
            type: String,
            default: () => 'fa-trash'
        },
        changeIcon: {
            type: String,
            default: () => 'fa-file'
        },
        cropIcon: {
            type: String,
            default: () => 'fa-crop'
        },
        addIcon: {
            type: String,
            default: () => 'fa-plus'
        },
        viewIcon: {
            type: String,
            default: () => 'fa-eye'
        },
        deleteIconTitle: {
            type: String,
            default: () => 'Delete'
        },
        changeIconTitle: {
            type: String,
            default: () => 'Change'
        },
        cropIconTitle: {
            type: String,
            default: () => 'Crop'
        },
        addIconTitle: {
            type: String,
            default: () => 'Add'
        },
        viewIconTitle: {
            type: String,
            default: () => 'View'
        },
        showViewBtn: {
            type: Boolean,
            default: () => false
        },
        layoutTag: {
            type: String,
            default: () => 'v-layout'
        },
        layoutProps: {
            type: Object,
            default: () => {
                return {
                    row: true,
                    wrap: true,
                    'fill-height': true,
                }
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
        validations () {
            return this.errors.slice(0, Number(this.errorCount))
        },
        hasItem () {
            return !validate.isEmpty(this.fileObject)
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
        fileInitializeValue: function () {
            return helper.getProp(
                this.$store.state.form, 
                `${this.formName}.initialize_values.${this.id}`,
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
            return this.thumb;
        },
    },
    render (h) {
        const addBtn = [
            this.showAddBtn || !this.showSelectedFile ? this.renderDefaultSlot() : null
        ];
        const fileItems = this.renderItems();
        const items = this.itemLocation === 'prepend' ? fileItems.concat(addBtn) : addBtn.concat(fileItems)

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
                    this.layoutTag,
                    {
                        attrs: this.layoutProps
                    },
                    items
                ),
                h(
                    'crop-dialog',
                    {
                        on: {
                            close: this.dialogClosedWithoutCrop 
                        }
                    }
                 ),
                this.genMessages()
            ]
        )
    },
    methods: {
        genMessages () {
            if (this.hideDetails) return null
            if (this.errors.length) {
                return this.$createElement(
                    'v-messages',
                    {
                        props: {
                            value: [this.validations], 
                            color: 'error' 
                        }
                    }
                )
            }
        },
        renderDefaultSlot() {
            if (this.$scopedSlots.default) {
                return this.$scopedSlots.default(
                    { 
                        openWindow: this.handleClick,
                        errors: this.errors
                    }
                )
            }
            return this.genItemContainer([this.genDefaultSelector()])
        },
        renderItems() {
            if (!this.hasItem || !this.showSelectedFile) {
                return [null]
            }
            if (!this.multiple) {
                return [this.genItemContainer([this.genFileItem(undefined)])];
            } else {
                return this.fileObject.map( (file, index) => {
                    return [this.genItemContainer([this.genFileItem(index)])]
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
                        'min-height': `${(this.boxHeight ? this.boxHeight : 100)}px`,
                        'height': '100%',
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
                            this.$createElement('v-icon', this.addIcon)
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
        genFileItem (fileIndex) {
            return this.$createElement(
                'file-item',
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
        onShowCropBox (fileObject, fileIndex) {
            this.showCropBox = true;
            this.fileIndexToCrop = fileIndex;
            this.fileObjectToCrop = fileObject;
        },
        onHideCropBox (emit = true) {
            this.showCropBox = false;
            this.fileIndexToCrop = null;
            this.fileObjectToCrop = null;
            if (emit) {
                this.$emit('cropped')
            }
        },
        handleClick() {
            if (!this.disabled) {
                this.openBrowser = true;
                this.$refs.input.value = null;
                this.$refs.input.click();
            }
        },
        onFileDelete (file, index) {
            if (this.$listeners.delete) {
                this.$listeners.delete({
                    deleteLocalFile: () => this.deleteFile(file),
                    file: file,
                    index: index
                });
            } else {
                this.deleteFile(file)
            }
        },
        dialogClosedWithoutCrop (file, index) {
            if (this.$listeners['close-dialog']) {
                this.$listeners['close-dialog']({
                    deleteLocalFile: () => this.deleteFile(file),
                    file: file,
                    index: index
                });
            } else {
                // console.log('I am calling Here.')
                // this.deleteFile(file)
            }
        },
        deleteFile (file) {
            if (!this.multiple) {
              this.setValue(null)
              if (this.fileInitializeValue) {
                  const fileval = {...this.fileInitializeValue}
                  this.$store.dispatch('form/setElementValue', {
                      formName: this.lqForm.name,
                      elementName: this.id,
                      value: fileval
                  });                  
              }
                   
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
    }
})