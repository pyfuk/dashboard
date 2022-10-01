<template>
  <div class="card">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>{{ $t('subjects.group.group_subjects_schedule') }}</h6>
      <argon-button color="success" @click="$router.push(`schedule/add`)">{{
          $t('common.add')
        }}
      </argon-button>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="subjectScheduler  .length && !isSubjectsSchedulerLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('subjects.name') }}
            </th>
            <th class="text-uppercase text-secondary text-xxs text-center font-weight-bolder opacity-7">
              {{ $t('subjects.lesson') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="subject in subjectScheduler  " :key="subject.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="text-center shadow icon icon-shape bg-gradient-dark icon-md mx-2">
                  <icon-view :img="subject.icon" size="lg" color="rgb(226, 231, 231)"></icon-view>
                </div>
                <div class="d-flex flex-column justify-content-center cursor-pointer"
                     @click="$router.push(`/subjects/${subject.id}`)">
                  <h6 class="mb-0 text-sm">{{ subject.name }}</h6>
                </div>
              </div>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="badge badge-sm bg-gradient-success">
              {{ subject.group ? $t('subjects.group') : $t('subjects.individual') }}
              </span>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-else-if="!isSubjectsSchedulerLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">{{ $t('common.no_data') }}</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isSubjectsSchedulerLoading">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import IconView from "../../../components/IconView";
import utilsMixin from "@/mixins/utilsMixin";
import axios from "axios";
import { server, timeout } from "@/config";
import ArgonButton from "@/components/ArgonButton";

export default {
  name: "group-subjects-schedule-table",
  components: {
    IconView,
    ArgonButton
  },
  props: {
    subject: {
      type: Object
    }
  },
  mixins: [utilsMixin],
  data() {
    return {
      subjectScheduler: [],
      isSubjectsSchedulerLoading: true,
    }
  },
  methods: {
    async getSubjects() {
      this.isSubjectsSchedulerLoading = true

      const data = {
        subject_id: this.subject.id
      }

      const response = await axios.post(server.URL + '/api/subjects/get_group_subject_schedule', data);

      console.log(response)
      this.subjectScheduler = response.subjectScheduler;
      this.isSubjectsSchedulerLoading = false
    }
  },
  async mounted() {
    await this.sleep(timeout.LIST_SLEEP);
    await this.getSubjects();
  },
}
</script>

<style scoped>

</style>
