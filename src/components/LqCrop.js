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
    render(h) {
        return h(
            'div',
            {
                style: {
                    height: '100%'
                },
            },
            [
                this.genProcessBar(),
                this.imageWarning(),
                this.genCropper()
            ]
        )
    },
    data: function () {
        return {
            rawData: '',
            loading: false,
            target: this.fileIndex !== undefined ? this.id + '.' + this.fileIndex : this.id,
            file: this.fileObject.original,
            orgWidth: null,
            orgHeight: null,
            cropWidth: null,
            cropHeight: null,
            imageLoaded: false,
            showWarning: false
        }
    },
    computed: {
        minWidth() {
            return this.$helper.getProp(this.lqFile.lqElRules, 'file.minImageDimensions.0')
        },
        minHeight() {
            return this.$helper.getProp(this.lqFile.lqElRules, 'file.minImageDimensions.1')
        },
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
            this.imageLoaded = false;
            let fReader = new FileReader();
            this.loading = true;
            fReader.onload = (e) => {
                this.rawData = e.target.result;
                this.initCrop()
                let img = new Image();
                img.onload = (imgEvent) => {
                    const imgE = imgEvent.width ? imgEvent : imgEvent.path[0];
                    this.orgWidth = imgE.width;
                    this.orgHeight = imgE.height;
                    this.imageLoaded = true;
                }
                img.src = e.target.result;
            }
            fReader.readAsDataURL(this.file);
        },
        initCrop: function () {
            this.$refs.croppieRef.refresh()
            this.$refs.croppieRef.bind({
                url: this.rawData,
            })
            this.loading = false;
        },
        cropImage: function (callBack) {
            this.getResult('original', (file, dimensions) => {
                if (this.validateSize(dimensions.width, dimensions.height)) {
                    this.getResult(this.lqFile.thumb, (newFile) => {
                        this.updateFile(newFile)
                        this.lqFile.validate();
                        this.$emit('cropped', this.fileObject, this.fileIndex);
                        if (typeof callBack === 'function') {
                            callBack(true)
                        }
                    })
                } else {
                    this.cropWidth = dimensions.width
                    this.cropHeight = dimensions.height
                    this.showWarning = true
                    if (typeof callBack === 'function') {
                        callBack(false)
                    }
                }

            })
        },
        getResult(size, callBack) {
            const options = {
                type: 'blob',
                size: size,
                format: this.circle ? 'png' : this.getFileExt(this.file.name),
                quality: 1,
                circle: this.circle
            }
            this.$refs.croppieRef.result(options, (output) => {
                let name = this.file.name
                let newFile = new File([output], name, { type: this.circle ? 'png' : this.file.type })
                let fReader = new FileReader();
                fReader.onload = (e) => {
                    let img = new Image();
                    img.onload = (imgEvent) => {
                        const imgE = imgEvent.width ? imgEvent : imgEvent.path[0];
                        callBack(newFile, { width: imgE.width, height: imgE.height })
                    }
                    img.src = e.target.result;
                }
                fReader.readAsDataURL(newFile);
            });
        },
        getFileExt(name) {
            let name_arr = name.split('.')
            return name_arr[name_arr.length - 1]
        },
        updateFile(newFile) {
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
            this.$store.dispatch('form/setElementValue', {
                formName: this.lqForm.name,
                elementName: this.target + '.uid',
                value: Date.now()
            })
        },
        createFileName(name, include) {
            let name_arr = name.split('.')
            name_arr[name_arr.length - 1] = include + '.' + name_arr[name_arr.length - 1]
            return name_arr.join('.')
        },
        validateSize(width, height) {
            if (this.minWidth && width < this.minWidth) {
                return false
            }
            if (this.minHeight && height < this.minHeight) {
                return false
            }
            return true;
        },
        genProcessBar() {
            if (!this.loading) return
            return this.$createElement('v-progress-linear', { props: { indeterminate: true } })
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
        },
        imageWarning() {
            if (!this.showWarning) return;
            return this.$createElement(
                'v-alert',
                {
                    props: {
                        value: true,
                        color: 'red',
                        dark: true,
                    }
                },
                `Original Image dimensions are ${this.orgWidth}x${this.orgHeight} and after cropped Image dimensions are ${this.cropWidth}x${this.cropHeight} but mininum required dimensions are ${this.minWidth}x${this.minHeight}. So Please Zoom out image and try again.`
            )
        }
    }
})