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
        },
        error () {
            return helper.getProp(
               this.$store.state.form, 
               [this.formName, 'errors', this.id],
               false
           );
       },
       formName () {
           return 'form_' + this.id;
       }
    },
    render (h) {
        if (!this.lqForm) {
            return h(
                'lq-form',
                {
                    props: {
                        name: this.formName,
                        rules: this.rules ? {[this.id]: this.rules} : undefined
                    },
                    ref: 'lqForm'
                },
                [this.genFile()]
            )
        }
        return this.genFile();

    },
    data () {
        return  {
            uploading: false
        }
    },
    methods: {
        genFile () {
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
                                    setTimeout(() => {
                                        if (!this.error && isImage(event.target.result)) {
                                            this.$refs.lqfile.onShowCropBox(e)
                                        }
                                    }, 1000)
                                   
                                }
                                fReader.readAsDataURL(e.file);
                                return;
                            }
                            if (!rules) {
                                this.uploadFile()
                            }
                        },
                        cropped: () => {
                            this.uploadFile();
                        },
                        'element-validated': (validateStatus) => {
                            !validateStatus ? ( !this.thumb ? this.uploadFile() : null) : this.onLocalError(validateStatus)
                        }
                        
                    },
                    ref: 'lqfile',
                    scopedSlots: this.$scopedSlots
                },
                this.$slots
            )
        },
        uploadFile() {
            if (this.uploading) {return false}
            this.$emit('uploading');
            this.uploading = true
            const values = {[this.id]: this.$refs.lqfile.formatter()};
            let form = undefined;
            if (this.otherData) {
                form = helper.objectToFormData(this.otherData)
            }
            const formData = helper.objectToFormData(values, form)
            this.$axios.post(this.action, formData)
                .then((response) => {
                    this.$emit('server-success', response)
                    this.uploading = false
                }).catch((error) => {
                    this.$emit('server-error', error)
                    this.$refs.lqfile.setValue(null)
                    this.uploading = false
                })
        },
        onLocalError (error) {
            this.$emit('local-error', error)
            this.$refs.lqfile.setValue(null)
        }
    }
})