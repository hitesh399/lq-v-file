<template>
  <v-app>
    <v-container fluid grid-list-xl>
      <v-layout align-center wrap>
        <v-flex md12>
          <FileUploadTest />
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import FileUploadTest from "./FileuploadTest";
export default {
  name: "playground",
  components: { FileUploadTest }
};
</script>