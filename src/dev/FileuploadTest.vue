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
              enable-drop-zone
              multiple
              show-reset-btn
              @upload-completed="completed"
              :upload-on-change="false"
              :thumb="{width:600, height: 600}"
            >
              <!-- <template
                v-slot:items="{rawData, fileObject, previewImage, isImage, uploadFnc, uploading}"
              >
                <img :src="previewImage" />
                <v-btn :disabled="uploading" @click.stop="uploadFnc">Upload</v-btn>
              </template> -->
              <template v-slot:top="{uploadFnc, processItems, totalItems}">
                <v-btn :disabled="processItems > 0" @click.stop="uploadFnc">Upload to Server {{totalItems}}/{{processItems}}</v-btn>
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
            // crop: true,
            minImageDimensions: [600, 600]
          },
          upload: {
            message: '^Image upload is require.'
          }
        }
      }
    };
  },
  methods: {
    completed() {
      console.log("Uploading completed.");
    }
  }
};
</script>