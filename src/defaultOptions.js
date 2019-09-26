const lqFileOptions =  {
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
        uploadFileName: 'file'
    },
    get uploadUrl() {
        return this.options.uploadUrl
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
            ...options
        }
    }
}

// const lqFileOptions =  optionsFnc();
export {lqFileOptions}