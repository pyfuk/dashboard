<template>
  <div class="form-group">
    <div :class="hasIcon(icon)">
      <span v-if="iconDir === 'left'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
      <input
          :type="type"
          class="form-control"
          :class="valid"
          :name="name"
          :id="id"
          :placeholder="placeholder"
          :isRequired="isRequired"
          :value="modelValue"
          @input="updateInput"
      />
      <div class="invalid-feedback">
        {{ validText }}
      </div>
      <span v-if="iconDir === 'right'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "argon-input",
  props: {
    valid: String,
    validText: String,
    icon: String,
    iconDir: String,
    name: String,
    id: String,
    modelValue: String,
    placeholder: String,
    type: String,
    isRequired: Boolean,
  },
  methods: {
    updateInput(event) {
      this.$emit('update:modelValue', event.target.value)
    },
    getIcon: (icon) => (icon ? icon : null),
    hasIcon: (icon) => (icon ? "input-group" : null),
  },
};
</script>
