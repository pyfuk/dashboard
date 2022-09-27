<template>
  <div class="form-group">
    <select class="form-control" :class="valid" :value="modelValue" @change="changeOptions" :disabled="disabled">
      <option disabled value="">Выберите из списка</option>
      <option v-for="option in options" :key="option.value" :value="option.value"> {{ option.name }}</option>
    </select>
    <div class="invalid-feedback">
      {{ validText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "argon-select",
  props: {
    modelValue: {
      type: String
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    valid: String,
    validText: String,
  },
  methods: {
    changeOptions(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script>

<style scoped>

</style>
