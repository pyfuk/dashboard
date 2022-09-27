<template>
  <ul class="pagination" :class="getClasses(color, size)" v-if="this.total > this.perPage">
    <argon-pagination-item @click="changePage(prevPage)" prev/>
    <argon-pagination-item v-if="hasFirst()" @click="changePage(1)" label="1"/>


    <argon-pagination-item v-if="hasFirst()" label="..."/>

    <argon-pagination-item v-for="page in pages" @click="changePage(page)" :label="`${page}`"
                           :active="current == page"/>

    <argon-pagination-item v-if="hasLast()" label="..."/>

    <argon-pagination-item v-if="hasLast()" @click="changePage(totalPages)" :label="`${totalPages}`"/>


    <argon-pagination-item @click="changePage(nextPage)" next/>
  </ul>
</template>

<script>
import ArgonPaginationItem from "@/components/ArgonPaginationItem";

export default {
  name: "argon-pagination",
  components: {
    ArgonPaginationItem,
  },
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    perPage: {
      type: Number,
      default: 9
    },
    pageRange: {
      type: Number,
      default: 2
    },
    textBeforeInput: {
      type: String,
      default: 'Go to page'
    },
    textAfterInput: {
      type: String,
      default: 'Go'
    },
    color: String,
    size: String,
  },

  data() {
    return {
      input: '',
    }
  },
  methods: {
    getClasses: (color, size) => {
      let colorValue, sizeValue;

      colorValue = color ? `pagination-${color}` : null;
      sizeValue = size ? `pagination-${size}` : null;

      return `${colorValue} ${sizeValue}`;
    },
    hasFirst: function () {
      return this.rangeStart !== 1
    },
    hasLast: function () {
      return this.rangeEnd < this.totalPages
    },
    hasPrev: function () {
      return this.current > 1
    },
    hasNext: function () {
      return this.current < this.totalPages
    },
    changePage: function (page) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('page-changed', page)
      }
    }
  },
  computed: {
    pages: function () {
      let pages = []
      for (let i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i)
      }
      return pages
    },
    rangeStart: function () {
      let start = this.current - this.pageRange
      return (start > 0) ? start : 1
    },
    rangeEnd: function () {
      let end = this.current + this.pageRange
      return (end < this.totalPages) ? end : this.totalPages
    },
    totalPages: function () {
      return Math.ceil(this.total / this.perPage)
    },
    nextPage: function () {
      return this.current + 1
    },
    prevPage: function () {
      return this.current - 1
    }
  },
};
</script>
