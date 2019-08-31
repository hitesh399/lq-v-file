import Vue from 'vue'

export default Vue.extend({
    name: 'lq-v-crop',
    props: {
        // target: String,
        id: String,
        fileIndex: Number,
        fileObject: {
            type: Object,
            required: true
        },
        viewport: {
          type: Object,
          required: true
        },
        size: {
          type: [String, Object],
          default: () => 'original'
        },
        showZoomer: {
            type: Boolean,
            default: () => true
        },
        enableResize: {
            type: Boolean,
            default: () => true
        },
        circle: {
            type: Boolean,
            default: () => false
        }
    },
    inject: ['lqForm', 'lqFile'],
    render (h) {
        return  h(
            'div',
            {
                style: {
                    height: `${this.lqFile.popupHeight - 40}px`
                },
            },
            [
                this.loading ? this.genProcessBar() : null,
                this.genCropper()
            ]
        )
    },
    data: function () {
        return {
            loading: false,
            rawData: '',
            target: this.fileIndex ? this.id + '.' + this.fileIndex : this.id,
            file: this.fileObject.original
        }
    },
    created() {
        this.readFile();
      },
    watch: {
        file: function () {
            this.readFile();
        }
    },
    methods: {
        readFile() {
            if (!this.file) {
                return;
            }
            let fReader = new FileReader();
            this.loading = true;
            fReader.onload = (e) => {
                this.rawData = e.target.result;
                setTimeout(() => {
                    this.initCrop()
                }, 500)
            }
            fReader.readAsDataURL(this.file);
        },
        initCrop: function () {
            this.$refs.croppieRef.refresh()
            this.$refs.croppieRef.bind({
                url: this.rawData
            })
            this.loading = false;
        },
        cropImage: function () {
            const options = {
                type: 'blob',
                size: this.size,
                format: this.circle ? 'png' : this.getFileExt(this.file.name),
                quality: 1,
                circle: this.circle
            }
            this.$refs.croppieRef.result(options, (output) => {
                let name = this.file.name
                let newFile = new File([output], name , {type: this.circle ? 'png' : this.file.type })
                let elementName = this.target + '.file'
                this.$store.dispatch('form/setElementValue', {
                    formName: this.lqForm.name,
                    elementName,
                    value: newFile
                })
                this.$store.dispatch('form/setElementValue', {
                    formName: this.lqForm.name,
                    elementName: this.target + '.cropped',
                    value: true
                })
                this.lqFileItem.readFile();
                this.lqFile.validate();          
                this.$emit('cropped', this.fileObject, this.fileIndex);
            });
        },
        getFileExt(name) {
            let name_arr = name.split('.')
            return name_arr[name_arr.length -1]
        },
        createFileName(name, include) {
            let name_arr = name.split('.')
            name_arr[name_arr.length -1] = include + '.' + name_arr[name_arr.length -1]
            return name_arr.join('.')
        },
        genProcessBar () {
            return this.$createElement(
                'div', 
                { 
                    style: { 
                        width: '96%', position: 'absolute', top: '48px' 
                    } 
                },
                this.$createElement('v-progress-linear', {props: {indeterminate: true }})
            )
        },
        genCropper() {
            return this.$createElement(
                'vue-croppie', 
                {
                    ref: 'croppieRef',
                    props: {
                        viewport: this.viewport,
                        showZoomer: this.showZoomer,
                        enableResize: this.enableResize,
                        ...this.$attrs
                    }
                }
            )
        }
    }
})