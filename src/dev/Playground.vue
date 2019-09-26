<template>
  <v-app>
    <v-container fluid grid-list-xl>
      <v-layout align-center wrap>
        <v-flex md12>
          <!-- <FileUploadTest /> -->
          <FileTest />
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import FileUploadTest from "./FileuploadTest";
import FileTest from "./FileTest";
export default {
  name: "playground",
  components: { FileUploadTest, FileTest }
};
</script>