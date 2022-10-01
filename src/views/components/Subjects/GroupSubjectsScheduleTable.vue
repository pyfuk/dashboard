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
        <table v-if="subjectScheduler.length && !isSubjectsSchedulerLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{
                $t('subjects.group.name')
              }}
            </th>
            <th class="text-uppercase text-secondary text-xxs text-center font-weight-bolder opacity-7">
              {{ $t('subjects.group.teacher') }}
            </th>
            <th class="text-uppercase text-secondary text-xxs text-center font-weight-bolder opacity-7">
              {{ $t('subjects.group.students_count') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="subSche in subjectScheduler" :key="subject.id">
            <td>
              <h6 class="ms-4 mb-0 text-sm">{{ subSche.name }}</h6>
            </td>
            <td class="align-middle text-center text-sm">
              {{ subSche.teacher.firstname + ' ' + subSche.teacher.lastname }}
            </td>
            <td class="align-middle text-center text-sm">
              {{ subSche.students_count }}
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
