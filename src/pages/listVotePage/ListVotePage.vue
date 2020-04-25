<template>
  <div id="container">
    test
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ModelWrappedInPagination from "../../models/ModelWrappedInPagination";
import { Vote, VoteModelWrappedInPagination } from "@/models/VoteModels";
import { api } from "@/requests/requests";


  @Component
  export default class ListVoteComponent extends Vue {
    async created() {
      try {
        const votes: VoteModelWrappedInPagination = await api.votes.list();
        console.log(votes);
      } catch (err) {
        console.log(err);
      }
    }

  }
</script>

<style lang="scss" scoped>
  #container {
    margin: auto;
    width: 100%;
  }
</style>
