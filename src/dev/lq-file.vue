<template>
  <div class="item elevation-5"
    @click="isBlank ? handleClick() : null"
    :style="{
      height: boxHeight ? boxHeight : 100 + 'px',
      cursor: !this.disabled && isBlank ? 'pointer' : 'inherit'
    }">
    <input class="d-none"
      type="file"
      ref="input"
      :name="name"
      :id="`${formName}.${id}`"
      @change="handleFileChange"
      :multiple="multiple" />
    <v-hover>
      <v-layout align-center justify-center row fill-height slot-scope="{ hover }">
        <v-icon v-if="isBlank || loading">fa-plus</v-icon>
        <v-img
          v-else-if="(isImage || (!file && uploadedFileType === 'image') )"
          :src="previewImage"
          :aspect-ratio="aspectRatio"
          class="grey lighten-2"
          >
          <v-expand-transition>
            <div
              v-if="hover && openBrowser === false"
              class="d-flex transition-fast-in-fast-out backdrop"
              style="height: 100%; background: #F5F5F5; opacity: 0.5;"
            >
            <v-layout align-center justify-center column fill-height>
              <v-btn icon @click.stop="deleteFile">
                <v-icon>fa-trash</v-icon>
              </v-btn>
              <v-btn icon @click="handleClick">
                <v-icon>fa-file</v-icon>
              </v-btn>
              <v-btn icon @click.stop="showCropBox = true" v-if="isImage && file && thumb">
                <v-icon>fa-crop</v-icon>
              </v-btn>
            </v-layout>
            </div>
          </v-expand-transition>
        </v-img>
        <div v-else>
            <p>
            {{file ? file.name : 'No file Selectded.'}}}
             <v-expand-transition>
              <div
                  v-if="hover && openBrowser === false"
                  class="d-flex transition-fast-in-fast-out backdrop"
                  style="height: 100%; background: #F5F5F5; opacity: 0.5;"
                >
                <v-layout align-center justify-center column fill-height>
                  <v-btn icon @click.stop="deleteFile">
                    <v-icon>fa-trash</v-icon>
                  </v-btn>
                  <v-btn icon @click="handleClick">
                    <v-icon>fa-file</v-icon>
                  </v-btn>
                  <v-btn icon @click.stop="showCropBox = true" v-if="isImage && file && thumb">
                    <v-icon>fa-crop</v-icon>
                  </v-btn>
                </v-layout>
              </div>
            </v-expand-transition>
            </p>
        </div>
      </v-layout>
    </v-hover>
    <v-dialog v-model="showCropBox" persistent scrollable :full-width="true">
      <v-card>
        <v-card-title v-if="popupTitle" class="headline">{{popupTitle}}</v-card-title>
        <v-card-text>
            <div
              :style="{
                height: popupHeight + 'px',
              }"
              >
              <lq-cropper ref="crop"
                :target="id"
                :size="thumbSize ? thumbSize : thumb"
                v-if="showCropBox"
                :file="originalFile"
                :viewport="viewport"
              />
            </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="$refs.crop.cropImage(); showCropBox= false;">Crop</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {lqFileMixin, lqPermissionMixin, lqElementMixin} from 'lq-form';
import  helper, {isImage} from 'vuejs-object-helper';
import LqCropper from './lq-cropper';

export default {
  name: 'lq-v-file',
  mixins: [lqElementMixin, lqPermissionMixin, lqFileMixin],
  components: {
    LqCropper
  },
  provide() {
		return {
			lqFile: this
		};
	},
  props: {
    boxHeight: Number,
    popupHeight: {
      type: Number,
      default: () => 300
    },
    circle: {
      type: Boolean,
      default: () => false
    },
    thumb: {
      type: Object,
      required: false
    },
    popupTitle: String,
    aspectRatio: {
      type: Number,
      default: () => 1
    },
    thumbSize: [String, Object]
  },
  data: function() {
    return {
      showCropBox: false,
      loading: false,
      isImage: false,
      imageRawData: '',
      hover: false,
      openBrowser: false,
      uploadedFileType: null
    }
  },
  computed: {
    file: function () {
      return helper.getProp(this.$store.state.form, `${this.formName}.values.${this.id}.file`, null);
    },
    isCropped: function () {
      return helper.getProp(this.$store.state.form, `${this.formName}.values.${this.id}.cropped`, null);
    },
    originalFile: function () {
      return helper.getProp(this.$store.state.form, `${this.formName}.values.${this.id}.original`, null);
    },
    fileObject: function () {
      return helper.getProp(this.$store.state.form, `${this.formName}.values.${this.id}`, null);
    },
    isBlank: function () {
      return !(this.file || this.uploadedFileUrl)
    },
    uploadedFileUrl: function () {
      return helper.getProp(this.$store.state.form, `${this.formName}.values.${this.id}.${this.valueKey}`, null);
    },
    viewport: function () {

      if (!this.thumb) {
        return false;
      }
      if (this.popupHeight <= this.thumb.height) {
          let newHeight  = (this.popupHeight - 20);
          let newWidth = this.thumb.width/this.thumb.height * newHeight
          return {
            width: newWidth,
            height: newHeight
          }
      }
      return this.thumb;
    },
    previewImage: function () {
      return this.imageRawData ? this.imageRawData : (this.uploadedFileUrl ? this.uploadedFileUrl : '')
    }
  },
  created: function() {
    this.$lqForm.addProp(this.formName, this.id, 'formatter', this.formatter)
  },
  methods: {
    readFile(openPopup = true) {
      if (!this.file) {
        return;
      }
      this.openBrowser = false;
      let fReader = new FileReader();
      this.loading = true;
      fReader.onload = (e) => {
          this.isImage  =  isImage(e.target.result) ? true : false;
          if (this.isImage && !this.isCropped && openPopup && this.thumb) {
            this.showCropBox = true;
          }
          this.loading = false;
          this.imageRawData = e.target.result;
      }
      fReader.readAsDataURL(this.file);
    },
    handleClick() {
      if (!this.disabled) {
        this.openBrowser = true;
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    deleteFile () {
      this.setValue(null);
    },
    formatter () {
      return this.fileObject ? {
        file: this.file ? this.file: '',
        id: this.fileObject.id ? this.fileObject.id : ''
      } : null;
    }
  },
  watch: {
    fileObject: function (newFile, oldFile) {
      !oldFile || newFile.uid !==  oldFile.uid ? this.readFile() : null;
    },
    uploadedFileUrl: function (newUrl, oldUrl) {
      if (!newUrl) {
          this.uploadedFileType = null;
          return;
        }
        var img = new Image();
        img.onload = (e) => {
          if (e.type === 'load') {
            this.uploadedFileType = 'image'
          } else {
            this.uploadedFileType = 'file'
          }
        }
        img.src = newUrl;
    }
  },
}
</script>
