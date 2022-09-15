<template>
  <div class="card">
    <div class="p-3 pb-0 card-header">
      <h6 class="mb-0">{{ cardTitle }}</h6>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group" v-if="subjects.length">
        <category-card v-for="subject of subjects" :subject="subject" :key="subject._id"/>
      </ul>
      <h2 v-else style="color: red">
        Список постов пуст
      </h2>
    </div>
  </div>
</template>

<script>
import CategoryCard from "./CategoryCard";

export default {
  name: "categories-card",
  components: { CategoryCard },
  props: {
    cardTitle: {
      type: String,
    },
    subjects: {
      type: Array,
      required: true
    }
  },
};
</script>
