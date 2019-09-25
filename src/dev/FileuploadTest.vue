<template>
  <v-app>
    <v-container fluid grid-list-xl>
      <v-layout align-center wrap>
        <v-flex md12>
          File Upload Test
          <lq-form
            :rules="rules"
            name="test_form"
            action="http://localhost:8080"
            content-type="formdata"
          >
            <lq-v-file-upload
              show-view-btn
              :enable-rotate="false"
              id="my_file"
              action="http://localhost/lq_server_sample/public/api/media"
              token-action="http://localhost/lq_server_sample/public/api/media-token"
              enable-drop-zone
              show-reset-btn
              :upload-on-change="false"
              :thumb="{width:600, height: 600}"
            >
              <template v-slot:items="{rawData, fileObject, previewImage, isImage, uploadFnc, uploading}">
                <img :src="previewImage" />
                <v-btn :disabled="uploading" @click.stop="uploadFnc">Upload</v-btn>
              </template>
            </lq-v-file-upload>

            <v-btn type="submit">Save</v-btn>
            <v-btn type="button" @click.prevent="init">Init</v-btn>
          </lq-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import LqForm from "./lq-form";
export default {
  components: {
    LqForm
  },
  data() {
    return {
      rules: {
        my_file: {
          file: {
            message: {
              acceptedFiles: "^Please select only image.",
              maxFileSize: "^Image size should be less than 50 MB."
            },
            acceptedFiles: "image/*",
            maxFileSize: 50,
            minImageDimensions: [600, 600]
          }
        }
      }
    };
  },
  methods: {}
};
</script>