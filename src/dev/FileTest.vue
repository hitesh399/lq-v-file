<template>
    <div>
        <lq-form
            :rules="rules"
            name="test_form"
            action="http://localhost:8080"
            content-type="formdata"
        >
            <lq-v-file
                show-view-btn
                :enable-rotate="false"
                id="my_file"
                enable-drop-zone
                multiple
                show-reset-btn
                :thumb="{width:600, height: 600}"
            />
            <v-btn type="submit">Save</v-btn>
            <v-btn type="button" @click.prevent="init">Init</v-btn>
        </lq-form>
        <!-- <lq-single-upload-file
      id="test_file"
      action="http://localhost/lq_server_sample/public/api/login"
      @uploading="uploading"
      @local-error="error"
      @server-error="error"
      :rules="rules.my_file"
      @server-success="success"
      hideDetails
      :thumb="{width:600, height: 600}"
    >
      <template v-slot:default="{openWindow, errors}">
        <v-btn @click.prevent="openWindow()">Choose file to Upload</v-btn>
      </template>
        </lq-single-upload-file>-->
    </div>
</template>
<script>
import LqForm from './lq-form';
export default {
    components: {
        LqForm
    },
    data() {
        return {
            rules: {
                my_file: {
                    // presence: {allowEmpty: false},
                    file: {
                        crop: true,
                        message: {
                            acceptedFiles: '^Please select only image.',
                            maxFileSize:
                                '^Image size should be less than 50 MB.'
                        },
                        acceptedFiles: 'image/*',
                        maxFileSize: 50,
                        minImageDimensions: [600, 600]
                    }
                }
            }
        };
    },
    methods: {
        deleteFile({ deleteLocalFile }) {
            console.log('delete');
            deleteLocalFile();
        },
        init: function() {
            this.$lqForm.initializeValues('test_form', {
                my_file: [
                    {
                        path: 'https://tineye.com/images/widgets/mona.jpg',
                        id: 1
                    },
                    {
                        path: 'https://image.shutterstock.com/image-photo/majestic-view-on-turquoise-water-260nw-266538056.jpg',
                        id: 2
                    },
                    {
                        path: 'https://webneel.com/wallpaper/sites/default/files/images/08-2018/3-nature-wallpaper-mountain.jpg',
                        id: 3
                    }
                ]
            });
        },
        uploading() {
            console.log('I am updating...');
        },
        error(e1, e2) {
            console.log('I am error', e1, e2);
        },
        success() {
            console.log('I am success');
        }
    }
};
</script>