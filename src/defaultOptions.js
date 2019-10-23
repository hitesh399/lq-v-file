const lqFileOptions = {
    options: {
        cropperPopupWidth: 400,
        rotateRightIcon: 'fa-repeat',
        rotateLeftIcon: 'fa-undo',
        deleteIcon: 'fa-trash',
        changeIcon: 'fa-file',
        cropIcon: 'fa-crop',
        addIcon: 'fa-plus',
        viewIcon: 'fa-eye',
        deleteIconTitle: 'Delete',
        changeIconTitle: 'Change',
        cropIconTitle: 'Crop',
        addIconTitle: 'Add',
        viewIconTitle: 'View',
        resetIconTitle: 'Reset',
        resetIcon: 'fa-refresh',
        uploadUrl: 'http://localhost/lq_server_sample/public/api/media',
        tokenUrl: 'http://localhost/lq_server_sample/public/api/media-token',
        uploadFileName: 'file',
        uploadResponseKey: 'data.media',
        formatterFnc: function () {
            let fileObject = !this.multiple && this.fileObject ? [this.fileObject] : this.fileObject;
            if (!fileObject) return
            let outPut = fileObject.map(f => {
                return {
                    file: f.file ? f.file : '',
                    id: f.id ? f.id : '',
                }
            });
            return !this.multiple && outPut ? outPut[0] : outPut;
        },
        uploadFnc: async function () {
            if (this.uploading) { return false }
            if (this.error && !this.isOnlyUploadError()) { return false }
            const token = await this.generateToken()
            this.upload(token.data.media_token.token)

        }
    },
    get uploadUrl() {
        return this.options.uploadUrl
    },
    get formatterFnc() {
        return this.options.formatterFnc
    },
    get uploadResponseKey() {
        return this.options.uploadResponseKey
    },
    get uploadFnc() {
        return this.options.uploadFnc
    },
    get uploadFileName() {
        return this.options.uploadFileName
    },
    get tokenUrl() {
        return this.options.tokenUrl
    },
    get cropperPopupWidth() {
        return this.options.cropperPopupWidth
    },
    get rotateRightIcon() {
        return this.options.rotateRightIcon
    },
    get rotateLeftIcon() {
        return this.options.rotateLeftIcon
    },
    get deleteIcon() {
        return this.options.deleteIcon
    },
    get changeIcon() {
        return this.options.changeIcon
    },
    get cropIcon() {
        return this.options.cropIcon
    },
    get addIcon() {
        return this.options.addIcon
    },
    get viewIcon() {
        return this.options.viewIcon
    },
    get deleteIconTitle() {
        return this.options.deleteIconTitle
    },
    get changeIconTitle() {
        return this.options.changeIconTitle
    },
    get cropIconTitle() {
        return this.options.cropIconTitle
    },
    get addIconTitle() {
        return this.options.addIconTitle
    },
    get viewIconTitle() {
        return this.options.viewIconTitle
    },
    get resetIconTitle() {
        return this.options.resetIconTitle
    },
    get resetIcon() {
        return this.options.resetIcon
    },
    merge: function (options) {
        this.options = {
            ...this.options,
            ...this.extractOptions(options)
        }
    },
    extractOptions(attrs) {
        const option_keys = Object.keys(this.options)
        let data = {}
        option_keys.forEach(k => {
            const val = attrs[k]
            if (val !== undefined) {
                data[k] = val
            }
        })
        return data;
    }
}

// const lqFileOptions =  optionsFnc();
export { lqFileOptions }