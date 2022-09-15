<template>
  <div class="d-flex flex-wrap justify-content-center">
    <div class="text-center shadow icon icon-shape icon-md mx-2 mt-2" @click="selectIcon('guitar')"
         :class="selected === 'guitar'? 'bg-gradient-success' : 'bg-gradient-dark'">
      <icon-view img="guitar" size="lg" color="rgb(226, 231, 231)"></icon-view>
    </div>
    <div class="text-center shadow icon icon-shape icon-md mx-2 mt-2" @click="selectIcon('drum')"
         :class="selected === 'drum'? 'bg-gradient-success' : 'bg-gradient-dark'">
      <icon-view img="drum" size="lg" color="rgb(226, 231, 231)"></icon-view>
    </div>
  </div>
</template>

<script>
import IconView from "../../../components/IconView";

export default {
  name: "SubjectIcons",
  components: { IconView },
  data() {
    return {
      selected: 'guitar',
    }
  },
  methods: {
    selectIcon(icon) {
      this.selected = icon;
      this.$emit('selected', icon)
    }
  }
}
</script>

<style scoped>
.changesize {
  font-size: 1.5em
}
</style>