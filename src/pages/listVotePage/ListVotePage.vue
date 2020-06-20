<template>
  <div id="listVotePage">
    <div id="subtitleContainer">
      <div id="subtitle">投稿されたアンケート</div>
      <div
        id="sortButton"
        @click="isActiveSortingMenu=!isActiveSortingMenu"
        :class="{ 'is-active-sorting-menu': isActiveSortingMenu }"
      >
        <i class="fas fa-list"></i>
        {{ getOrderingUserString() }}
        <div id="sortButtonSubMenu">
          <ul>
            <li @click="query.ordering='-created_at';reflectQuery(true);">新着順</li>
            <li @click="query.ordering='-vote_count';reflectQuery(true);">回答数が多い順</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="right" id="searchWindowContainer">
      <input
        type="text"
        class="field-input"
        v-model="query.like"
        @keyup.enter="reflectQuery(resetPageNumber=true)"
      />
      <button class="search-button" @click="reflectQuery(resetPageNumber=true)">
        <i class="fas fa-search"></i>
      </button>
    </div>
    <div class="clear"></div>
    <ul id="voteList" v-if="votes">
      <li class="voteContainer" v-for="vote in votes">
        <div class="vote" :class="{'is-closed': vote.isClosed()}">
          <div class="vote-header">
            <router-link :to="`/detail/${vote.pk}`" class="vote-title">
              <h3>{{ omitTooLongString(vote.title) }}</h3>
            </router-link>
          </div>
          <div class="vote-main multiline-text">{{ omitTooLongLines(vote.description) }}</div>
          <div class="vote-footer">
            <div class="vote-tags">
              <template v-if="vote.tags.length > 0">
                <a
                  class="vote-tag"
                  v-for="tag in vote.tags"
                  :key="tag"
                  @click="query.like=tag;reflectQuery(resetPageNumber=true);"
                  style="cursor:pointer;"
                >{{ tag }}</a>
              </template>
              <span v-else>タグ:&nbsp;なし</span>
            </div>
            <div>
              <span class="vote-count">回答数:&nbsp;{{ vote.vote_count }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <paginate
      :value="getPageNumber()"
      @input="setPageNumber"
      :page-count="pageCount"
      :prev-text="'＜'"
      :next-text="'＞'"
      :container-class="'pagination-container'"
      :page-class="'page-li'"
      :prev-class="'pagination-prev'"
      :next-class="'pagination-next'"
      :click-handler="paginationClickCallback"
      v-if="votes&&votes.length>0"
    ></paginate>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { api } from "@/requests/requests";
import { OneSelectQuestion, Vote } from "@/entities/VoteEntities";
import { OneSelectOption } from "@/entities/VoteEntities";
import {
  VoteWrappedInPagination,
  EntityWrappedInPageNumberPagination
} from "@/entities/EntityWrappedInPagination";
import SuguvoteVue from "@/utils/SuguvoteVue.vue";
import { Dictionary } from "vue-router/types/router";
import { DEFAULT_PAGE_SIZE } from "@/const/CommonConst";
import { Watch } from "vue-property-decorator";
import { SuguvotePageVue } from "@/SuguvoteVue";

// TODO: Change a design of this page
// TODO: Implement showing creator's user name
// TODO: Implement feature of chaning page size
@Component
export default class ListVotePageComponent extends SuguvotePageVue {
  votes: Readonly<Vote[]> | null = null;
  isActiveSortingMenu: boolean = false;
  pageCount: number = -1;
  query: Dictionary<string | (string | null)[] | null | undefined> = {
    size: undefined,
    ordering: undefined,
    like: "",
    page: undefined
  };

  async created() {
    await this.updatePage();
  }

  async updatePage() {
    this.query = {
      size: this.$route.query?.size ?? undefined,
      ordering: this.$route.query?.ordering ?? undefined,
      like: this.$route.query?.like ?? undefined,
      page: this.$route.query?.page ?? undefined
    };
    //範囲外のページが指定された時に、指定されたページ数になるようにするために代入
    this.pageCount = this.getPageNumber();

    try {
      this.fetchVotes();
    } catch (err) {
      console.log(err);
    }
  }

  async fetchVotes() {
    const votes: VoteWrappedInPagination = await api.votes.list(
      this.query
    );
    this.votes = votes.results ?? [];
    this.pageCount = this.calcPageCount(votes);
  }

  async reflectQuery(resetPageNumber: boolean = false) {
    if (resetPageNumber) this.query["page"] = undefined;

    window.scrollTo(0, 0);

    this.$router.push(
      {
        path: this.$route.path,
        query: this.query
      },
      () => {},
      () => {}
    );
  }

  @Watch("$route.query")
  async onQueryChanged(to: any, from: any) {
    await this.updatePage();
  }

  getOrderingUserString(): string {
    switch (this.query["ordering"]) {
      case "-created_at":
        return "新着順";
      case "-vote_count":
        return "回答数が多い順";
      case undefined:
        return "新着順";
      default:
        return "カスタム";
    }
  }

  async paginationClickCallback() {
    await this.reflectQuery();
  }

  getPageNumber(): number {
    return parseInt(this.query["page"]?.toString() ?? "1");
  }

  setPageNumber(input: any): void {
    this.query["page"] = input;
  }

  calcPageCount(
    modelWrappedInPagination: EntityWrappedInPageNumberPagination
  ): number {
    if (!modelWrappedInPagination.count)
      return this.query["page"]
        ? parseInt(this.query["page"]?.toString() ?? 0)
        : 0;

    const size: number = this.query["size"]
      ? parseInt(this.query["size"]?.toString() ?? NaN)
      : DEFAULT_PAGE_SIZE;
    if (size == NaN)
      return this.query["page"]
        ? parseInt(this.query["page"]?.toString() ?? 0)
        : 0;

    return Math.ceil(modelWrappedInPagination.count / size);
  }
}
</script>

<style lang="scss" scoped>
#subtitleContainer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-top: 2rem;
  border-bottom: 2px solid #999;
}

#subtitle {
  font-size: 150%;
  font-weight: bold;
}

#sortButton {
  font-size: 110%;
  margin-right: 3rem;
  padding: 0.5rem 0;
  text-decoration: none;
  color: #000;
  transition: background-color 0.2s;
  width: 12rem;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }
  #sortButtonSubMenu {
    position: absolute;
    transition: opacity 0.2s, visibility 0.2s;
    a {
      color: #000;
      text-decoration: none;
    }
    ul {
      list-style: none;
      margin: 0.5rem 0 0 0;
      padding: 0;
    }
    li {
      width: 10rem;
      margin: 0;
      background-color: #f9f9f9;
      padding: 0.5rem 0;
      transition: background-color 0.2s;
      &:hover {
        background-color: #ccc;
      }
    }
  }
  &:not(.is-active-sorting-menu) #sortButtonSubMenu {
    visibility: hidden;
    opacity: 0;
  }
  &.is-active-sorting-menu #sortButtonSubMenu {
    visibility: visible;
    opacity: 1;
  }
}

ul#voteList {
  list-style-type: none;
  padding: 0;

  li.voteContainer {
    margin: 3rem auto;
    min-height: 100px;
    border: 2px solid #cccccc;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;

    .vote {
      margin: 0;
      padding: 1em;

      &.is-closed {
        border-left: 10px solid #ccc;
      }
      &:not(.is-closed) {
        border-left: 10px solid #90ee90;
      }

      .vote-title {
        font-size: 130%;
        color: inherit;
        text-decoration: inherit;
        &:hover {
          text-decoration: underline;
        }
        h3 {
          word-break: break-all;
          margin: 0;
        }
      }

      .vote-main {
        margin: 1rem auto;
      }

      .vote-footer {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem auto;
      }

      .vote-count {
        margin-top: 0.5rem;
        display: inline-block;
        @media screen and (max-width: 767px) {
          width: 100%;
        }
      }
    }
  }
}

.search-button {
  margin: 0 5px;
  font-size: 1.5rem;
  border: 0;
  background-color: #f0f0f0;
  transition: background-color 0.1s;

  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
