import axios from "axios";
import { server } from "../config";

export const subjectsModule = {
    state() {
        return {
            subjects: [],
            subjectsForSelect: [],
            userSubjects: []
        }
    },
    getters: {},
    mutations: {
        setSubjects(state, subjects) {
            state.subjects = subjects
        },
        setSubjectsForSelect(state, subjectsForSelect) {
            state.subjectsForSelect = subjectsForSelect
        },
        setUserSubjects(state, userSubjects) {
            state.userSubjects = userSubjects
        }
    },
    actions: {
        async getSubjects({ commit }) {

            const response = await axios.post(server.URL + '/api/subjects/get_all');
            commit('setSubjects', response.subjects)
            const subjectsForSelect = response.subjects.map(s => {
                return {
                    name: s.name,
                    value: s.id
                }
            })
            commit('setSubjectsForSelect', subjectsForSelect)
        },
        async addSubjectToArray({ state, commit }, subject) {
            let subjects = state.subjects;
            if (subjects.length > 10) {
                subjects.pop();
            }
            subjects = [subject, ...subjects]
            commit('setSubjects', subjects);
        },
        async getUserSubjects({ commit }, user_id) {
            const data = {
                teacher_id: user_id
            }
            const res = await axios.post(server.URL + '/api/subjects/get_teacher_subjects', data)

            const subjects = res.data.map(s => {
                return {
                    title: s.name,
                    icon: s.icon
                }
            })

            commit('setUserSubjects', subjects)
        },
        async addUserSubjectToArray({ state, commit }, subject) {
            let subjects = state.subjects;
            if (subjects.length > 10) {
                subjects.pop();
            }
            subjects = [subject, ...subjects]
            commit('setSubjects', subjects);
        },
    },
    namespaced: true
}
