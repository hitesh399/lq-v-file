<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px">
    <template v-slot:activator="{ on }">
        <lq-v-text-field
          :id="id"
          :label="label"
          prepend-icon="event"
          @click:prepend="menu=true"
          readonly
          :init-value="(multiple ? [] : null)"
          ref="textInput"
          clearable
          :custom-mask="parseDate"
          v-on="on">
        </lq-v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        :multiple="multiple"
        v-bind="$attrs">
        <v-spacer></v-spacer>
      </v-date-picker>
  </v-menu>
</template>

<script>
import helper from 'vuejs-object-helper';
import moment from 'moment';

export default {
  name: 'lq-date-picker',
  inject: ['lqForm'],
  props: {
    id: {
      type: String,
      required: true
    },
    label: String,
    format: {
      type: String,
      default: () => 'DD/MM/YYYY'
    },
    multiple: Boolean
  },
  data: function() {
    return {
      menu: false
    }
  },
  computed: {
    date: {
      get: function() {
       return helper.getProp(this.$store.state.form,`${this.lqForm.name}.values.${this.id}`);
      },
      set: function(val) {
        this.$refs.textInput.internalValue = val;
      }
    }
  },
  methods: {
    parseDate (date) {
      console.log('I am here ti ,', date)
      if (!date) return null;
      if(helper.isArray(date)) {
        return date.map( (d) => {
          return moment(d).format(this.format);
        }).join(', ');
      }
      return moment(date).format(this.format);
    },
  }
}
</script>

<style>

</style>
