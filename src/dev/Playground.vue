<template>
  <v-app>
 <v-container
    fluid
    grid-list-xl>
      <v-layout
        align-center
        wrap>
        <v-flex md12>
          I am Her easkdskjhdk
          <lq-form name="test_form" action="http://localhost:8080" content-type="formdata">
            <lq-v-file id="my_file" :thumb="{width:600, height:600}"  />
          </lq-form>
        </v-flex>
    </v-layout>
 </v-container>
  </v-app>
</template>
<script>
import LqForm from './lq-form'
export default {
  components: {
    LqForm
  }
}
</script>