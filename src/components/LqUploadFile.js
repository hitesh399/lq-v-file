import Vue from 'vue'
import helper, { isImage } from 'vuejs-object-helper'
import LqForm from './LqForm'

export default Vue.extend({
    name: 'lq-upload-file',
    components: { LqForm },
    props: {
        action: {
            required: true,
            type: String
        },
        id: {
            type: String,
            required: true,
        },
        otherData: Object,
        thumb: {
            type: Object,
            required: false
        },
        rules: Object,
    },
    computed: {
        myLqForm () {
            return this.$refs.lqForm;
        }
    },
    render (h) {
        if (!this.lqForm) {
            return h(
                'lq-form',
                {
                    props: {
                        name: 'form_' + this.id,
                        rules: this.rules ? {[this.id]: this.rules} : undefined
                    },
                    ref: 'lqForm'
                },
                [this.genFile()]
            )
        }
        return this.genFile();

    },
    methods: {
        genFile () {
            console.log('this.$attrs', this.$attrs)
            return this.$createElement(
                'lq-v-file',
                {
                    props: {
                        id: this.id,
                        showSelectedFile: false,
                        thumb: this.thumb,
                        ...this.$attrs,
                        multiple: false
                    },
                    on: {
                        changed: (e) => {
                            const rules = this.$refs.lqfile.lqElRules
                            if (this.thumb) {
                                let fReader = new FileReader();
                                this.loading = true;
                                fReader.onload = (event) => {
                                   if (isImage(event.target.result)) {
                                    this.$refs.lqfile.onShowCropBox(e)
                                   }
                                }
                                fReader.readAsDataURL(e.file);
                                return;
                            }
                            if (!rules) {
                                this.uploadFile()
                            }
                        },
                        cropped: () => {
                            const rules = this.$refs.lqfile.lqElRules
                            if (!rules) {
                                this.uploadFile();
                            }
                        },
                        'element-validated': (validateStatus) => {
                            !validateStatus ? this.uploadFile() : this.onLocalError()
                        }
                        
                    },
                    ref: 'lqfile',
                    scopedSlots: this.$scopedSlots
                },
                this.$slots
            )
        },
        uploadFile() {
            this.$emit('uploading');
            const values = {[this.id]: this.$refs.lqfile.formatter()};
            let form = undefined;
            if (this.otherData) {
                form = helper.objectToFormData(this.otherData)
            }
            const formData = helper.objectToFormData(values, form)
            this.$axios.post(this.action, formData)
                .then((response) => {
                    this.$emit('server-success', response)
                }).catch((error) => {
                    this.$emit('server-error', error)
                    this.$refs.lqfile.setValue(null)
                })
        },
        onLocalError (error) {
            this.$emit('local-error', error)
            this.$refs.lqfile.setValue(null)
        }
    }
})