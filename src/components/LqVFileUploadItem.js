import LqVFileItem from './LqVFileItem'
import helper from 'vuejs-object-helper'

export default LqVFileItem.extend({
    name: 'lq-v-file-item-upload',
    inject: ['lqFileUpload'],
    computed: {
        itemScoped() {
            return {
                isImage: this.isImage,
                loading: this.loading,
                rawData: this.imageRawData,
                deleteFnc: () => this.$emit('delete', this.fileObject, this.fileIndex),
                changeFnc: () => this.$emit('open-window', this.fileIndex),
                viewFnc: () => this.viewFile,
                resetFnc: () => this.resetFile,
                cropFnc: () => this.openCropper,
                canShowCropper: this.canShowCropper,
                previewImage: this.previewImage,
                fileObject: this.fileObject,
                fileIndex: this.fileIndex,
                uploadFnc: this.uploadFile,
                errors: this.errors
            }
        }
    },
    data () {
        return {
            error_in_rules: []
        }
    },
    methods: {
        async uploadFile() {

            if (this.uploading) { return false }
            const only_upload_error = (this.error_in_rules.length === 1 && this.error_in_rules[0] === 'upload');

            if (this.error && !only_upload_error) {return false}

            this.lqForm.ready(false);
            const token = await this.$axios.post(this.lqFileUpload.tokenAction, {
                size: this.file.size,
                name: this.file.name
            })
            this.uploading = true
            this.upload(token.data.media_token.token)

        },
        upload(token) {
            this.uploadProcess = 0
            const values = {
                file: { file: this.file },
                token
            };
            const formData = helper.objectToFormData(values)

            this.$axios.post(this.lqFileUpload.action, formData, 
            {
                onUploadProgress: (progressEvent) => { 
                    this.uploadProcess = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                }
            }).then((response) => {
                this.$emit('server-success', response)
                let final_data = { ...this.fileObject, ...response.data.media }
                delete final_data.file
                delete final_data.original
                delete final_data.uid
                this.uploading = false
                this.$store.dispatch('form/setElementValue', {
                    formName: this.lqFileUpload.lqForm.name,
                    elementName: this.fileId,
                    value: final_data
                });
                this.fireWhenUploadCompleted()

            }).catch((error) => {
                this.$emit('server-error', error)
                this.uploading = false
                this.fireWhenUploadCompleted()
            })
        },
        afterFileReadAction(showCroped) {
            LqVFileItem.options.methods.afterFileReadAction.call(this, showCroped)
            if (!this.lqFile.thumb && !this.lqFile.lqElRules && this.lqFile.uploadOnChange) {
                this.uploadFile()
            }
        },
        async fireWhenUploadCompleted() {
            if (!this.lqFileUpload.fileItems.some(v => v.uploading)) {
                this.lqForm.ready(true);
                await this.lqFileUpload.validate(true, true, false, false)
                this.$emit('upload-completed');
            }
        },
        whenFileValidated(errors, error_in_rules) {
            this.error_in_rules = error_in_rules
            LqVFileItem.options.methods.whenFileValidated.call(this, errors, error_in_rules)
            if (!errors && this.lqFile.thumb && this.isCropped && this.lqFile.uploadOnChange) {
                this.uploadFile()
            }
        },
    },
    created() {
        this.lqFileUpload.fileItems.push(this)
    },
    beforeDestroy() {
        let index = null
        this.lqFileUpload.fileItems.every((file, i) => {
            if ((file.id && file.id === this.file.id) || (file.uuid && file.uuid === this.file.uuid)) {
                index = i
                return false;
            } else {
                return true;
            }
        })
        if (index !== null) {
            this.lqFileUpload.fileItems.splice(index, 1)
        }
    }
})